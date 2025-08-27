import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Heading, Text, SimpleGrid, HStack, VStack,
  Select, Button, Spinner, useColorModeValue, Stat, StatLabel, StatNumber
} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import API from "../api";

// ---- helpers ----
const parseLocal = (ts) => {
  const [d, t] = ts.replace(" ", "T").split("T");
  const [y, m, d2] = d.split("-").map(Number);
  if (!t) return new Date(y, m - 1, d2).getTime();
  const [hh, mm, ss = 0] = t.split(":").map(Number);
  return new Date(y, m - 1, d2, hh, mm, ss).getTime();
};
const fmtDay = (d) => new Date(d).toISOString().slice(0, 10);

// ---- main page ----
export default function PlantGenerationChart() {
  const cardBg = useColorModeValue("white", "gray.800");
  const [meta, setMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Controls
  const [plantA, plantB] = meta?.plants || [];
  const [selectedPlant, setSelectedPlant] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [day, setDay] = useState("2020-01-06"); // initial day drill-down

  // fetch meta once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/generation/meta");
        setMeta(data);
        setSelectedPlant(data.plants?.[0] || "");
        const from = data.minTime?.slice(0, 10) + "T00:00:00";
        const to   = data.maxTime?.slice(0, 10) + "T23:59:59";
        setRange({ from, to });
        setDay(data.minTime?.slice(0, 10) || "2020-01-06");
      } finally {
        setLoadingMeta(false);
      }
    })();
  }, []);

  if (loadingMeta) {
    return (
      <Container maxW="6xl" py={10}>
        <HStack><Spinner /><Text>Loading…</Text></HStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg">Plant Generation Dashboard</Heading>

        {/* Meta tiles */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Plants</StatLabel>
            <StatNumber>{meta.plants?.length || 0}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Inverters (4135001)</StatLabel>
            <StatNumber>{meta.inverterCounts?.["4135001"] ?? "-"}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Inverters (4136001)</StatLabel>
            <StatNumber>{meta.inverterCounts?.["4136001"] ?? "-"}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Date Range</StatLabel>
            <StatNumber fontSize="lg">
              {meta.minTime?.slice(0,10)} → {meta.maxTime?.slice(0,10)}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Controls */}
        <HStack gap={3} flexWrap="wrap">
          <HStack>
            <Text minW="60px">Plant</Text>
            <Select size="sm" value={selectedPlant} onChange={e => setSelectedPlant(e.target.value)}>
              {(meta.plants || []).map(pid => <option key={pid} value={pid}>{pid}</option>)}
            </Select>
          </HStack>
          <HStack>
            <Text minW="40px">From</Text>
            <input type="datetime-local" value={range.from} onChange={e => setRange(r => ({...r, from: e.target.value}))}/>
          </HStack>
          <HStack>
            <Text minW="24px">To</Text>
            <input type="datetime-local" value={range.to} onChange={e => setRange(r => ({...r, to: e.target.value}))}/>
          </HStack>
          <HStack>
            <Text minW="34px">Day</Text>
            <input type="date" value={day} onChange={e => setDay(e.target.value)} />
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Daily Energy (kWh)</Heading>
            <DailyEnergyChart from={range.from} to={range.to} />
          </Box>

          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Cumulative Energy</Heading>
            <CumulativeChart from={range.from} to={range.to} plantId={selectedPlant}/>
          </Box>

          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Day Profile (15-min) — {selectedPlant} · {day}</Heading>
            <DayProfileChart plantId={selectedPlant} day={day} />
          </Box>

          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Data Completeness (intervals/day)</Heading>
            <CompletenessChart from={range.from} to={range.to} plantId={selectedPlant}/>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

/* ===================== charts ===================== */

function DailyEnergyChart({ from, to }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/generation/daily", { params: { from, to } });
      setRows(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { if (from && to) load(); }, [from, to]);

  const plantIds = useMemo(() => [...new Set(rows.map(r => r.plantId))], [rows]);
  const days = useMemo(() => [...new Set(rows.map(r => r.day))], [rows]);

  const series = plantIds.map(pid => ({
    name: pid,
    data: days.map(day => {
      const r = rows.find(x => x.plantId === pid && x.day === day);
      return r ? r.kwh : 0;
    })
  }));

  const options = {
    chart: { type: "line", height: 330, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: days },
    yaxis: { title: { text: "kWh" }, min: 0 },
    tooltip: { shared: true }
  };

  return loading ? <Spinner/> : <Chart options={options} series={series} type="line" height={330} />;
}

function CumulativeChart({ from, to, plantId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/generation/daily-cumulative", { params: { from, to, plantId } });
      setRows(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { if (from && to && plantId) load(); }, [from, to, plantId]);

  const options = {
    chart: { type: "area", height: 330, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: rows.map(r => r.day) },
    yaxis: { title: { text: "kWh" }, min: 0 }
  };
  const series = [{ name: plantId, data: rows.map(r => r.kwh) }];

  return loading ? <Spinner/> : <Chart options={options} series={series} type="area" height={330} />;
}

function DayProfileChart({ plantId, day }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/generation/series", { params: { plantId, date: day } });
      setRows(data);
    } finally { setLoading(false); }
  };
  useEffect(() => { if (plantId && day) load(); }, [plantId, day]);

  const ac = rows.map(p => ({ x: parseLocal(p.time), y: p.acPower }));
  const dc = rows.map(p => ({ x: parseLocal(p.time), y: p.dcPower }));

  const options = {
    chart: { type: "line", height: 330, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 0 },
    xaxis: { type: "datetime", labels: { datetimeUTC: false } },
    yaxis: [
      { title: { text: "AC (kW)" }, min: 0 },
      { opposite: true, title: { text: "DC (kW)" }, min: 0 }
    ],
    tooltip: { shared: true }
  };
  const series = [
    { name: "AC Power", data: ac, yAxisIndex: 0 },
    { name: "DC Power", data: dc, yAxisIndex: 1 }
  ];

  return loading ? <Spinner/> : <Chart options={options} series={series} type="line" height={330} />;
}

function CompletenessChart({ from, to, plantId }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/generation/completeness", { params: { from, to, plantId } });
      setRows(data.filter(d => d.plantId === plantId));
    } finally { setLoading(false); }
  };
  useEffect(() => { if (from && to && plantId) load(); }, [from, to, plantId]);

  const categories = rows.map(r => r.day);
  const series = [{ name: "Intervals", data: rows.map(r => r.intervals) }];

  const options = {
    chart: { type: "bar", height: 330, toolbar: { show: false } },
    xaxis: { categories },
    yaxis: { title: { text: "Intervals (max 96)" }, min: 0, max: 96 },
    dataLabels: { enabled: false }
  };

  return loading ? <Spinner/> : <Chart options={options} series={series} type="bar" height={330} />;
}
