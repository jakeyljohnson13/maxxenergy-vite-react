// src/pages/PlantGenerationChart.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box, Container, Heading, Text, SimpleGrid, HStack, VStack,
  Select, Spinner, useColorModeValue, Stat, StatLabel, StatNumber
} from "@chakra-ui/react";
import Chart from "react-apexcharts";
import API from "../api";

/* ---------------- helpers ---------------- */

/** Parse "YYYY-MM-DDTHH:mm[:ss]" (or "YYYY-MM-DD HH:mm[:ss]") as LOCAL time (no UTC shift). */
const parseLocal = (ts) => {
  if (!ts) return NaN;
  const [datePart, timeRaw] = ts.replace(" ", "T").split("T");
  const [yy, mm, dd] = datePart.split("-").map(Number);
  const [hh = 0, mi = 0, ss = 0] = (timeRaw || "00:00:00").split(":").map(Number);
  return new Date(yy, mm - 1, dd, hh, mi, ss).getTime();
};

/** Convert ISO-ish string to <input type="datetime-local"> value (no seconds). */
const toDTLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(parseLocal(iso));
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

/** Ensure ":ss" present when sending to backend expecting seconds. */
const withSeconds = (dtLocal) => (dtLocal && dtLocal.length === 16 ? `${dtLocal}:00` : dtLocal);

/* ---------------- main page ---------------- */

export default function PlantGenerationChart() {
  const cardBg = useColorModeValue("white", "gray.800");
  const [summary, setSummary] = useState(null); // { plants:[{plantId,start,end,inverters,stepMinutes}], globalStart, globalEnd }
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Controls
  const plants = summary?.plants || [];
  const [selectedPlant, setSelectedPlant] = useState("");
  const [range, setRange] = useState({ from: "", to: "" }); // datetime-local values
  const [day, setDay] = useState("2020-01-06"); // date value

  // fetch summary once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await API.get("/generation/summary");
        if (cancelled) return;
        setSummary(data);

        const firstPlant = (data.plants && data.plants[0]?.plantId) || "4135001";
        setSelectedPlant(firstPlant);

        const gStart = data.globalStart || "2020-01-06T00:00:00";
        const gEnd   = data.globalEnd   || "2020-05-31T23:59:59";
        setRange({ from: toDTLocal(gStart), to: toDTLocal(gEnd) });
        setDay((data.globalStart || "2020-01-06T00:00:00").slice(0, 10));
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loadingMeta) {
    return (
      <Container maxW="6xl" py={10}>
        <HStack><Spinner /><Text>Loading…</Text></HStack>
      </Container>
    );
  }

  const selectedSummary = plants.find(p => p.plantId === selectedPlant);

  return (
    <Container maxW="7xl" py={8}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg">Plant Generation Dashboard</Heading>

        {/* Meta tiles */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Plants</StatLabel>
            <StatNumber>{plants.length}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Selected Plant</StatLabel>
            <StatNumber>{selectedPlant || "—"}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Inverters (Selected)</StatLabel>
            <StatNumber>{selectedSummary?.inverters ?? "—"}</StatNumber>
          </Stat>
          <Stat bg={cardBg} p={4} rounded="xl" shadow="sm">
            <StatLabel>Global Date Range</StatLabel>
            <StatNumber fontSize="lg">
              {(summary.globalStart || "").slice(0,10)} → {(summary.globalEnd || "").slice(0,10)}
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Controls */}
        <HStack gap={3} flexWrap="wrap">
          <HStack>
            <Text minW="60px">Plant</Text>
            <Select size="sm" value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
              {plants.map((p) => (
                <option key={p.plantId} value={p.plantId}>{p.plantId}</option>
              ))}
            </Select>
          </HStack>
          <HStack>
            <Text minW="40px">From</Text>
            <input
              type="datetime-local"
              value={range.from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
            />
          </HStack>
          <HStack>
            <Text minW="24px">To</Text>
            <input
              type="datetime-local"
              value={range.to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
            />
          </HStack>
          <HStack>
            <Text minW="34px">Daily</Text>
            <input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Daily Energy (kWh)</Heading>
            {/* all plants together (no plantId -> server returns both) */}
            <DailyEnergyChart from={withSeconds(range.from)} to={withSeconds(range.to)} />
          </Box>



          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Day Profile (15-min) — {selectedPlant} · {day}</Heading>
            <DayProfileChart plantId={selectedPlant} day={day} />
          </Box>
          
                    <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Cumulative Energy</Heading>
            {/* single plant cumulative */}
            <CumulativeChart
              from={withSeconds(range.from)}
              to={withSeconds(range.to)}
              plantId={selectedPlant}
            />
          </Box>

          <Box bg={cardBg} rounded="xl" shadow="md" p={4}>
            <Heading size="md" mb={2}>Data Completeness (intervals/day)</Heading>
            <CompletenessChart
              from={withSeconds(range.from)}
              to={withSeconds(range.to)}
              plantId={selectedPlant}
            />
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

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      // /daily-energy returns [{plantId, day, kwh, method}]
      const { data } = await API.get("/generation/daily-energy", { params: { from, to }, signal });
      setRows(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => {
    if (!from || !to) return;
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [from, to, load]);

  const plantIds = useMemo(() => [...new Set(rows.map(r => r.plantId))], [rows]);
  const days = useMemo(() => [...new Set(rows.map(r => r.day))], [rows]).sort();

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

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      // /cumulative returns [{plantId, day, totalKwh}]
      const { data } = await API.get("/generation/cumulative", {
        params: { plantId, from, to },
        signal
      });
      setRows(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, [from, to, plantId]);

  useEffect(() => {
    if (!from || !to || !plantId) return;
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [from, to, plantId, load]);

  const options = {
    chart: { type: "area", height: 330, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: rows.map(r => r.day) },
    yaxis: { title: { text: "kWh" }, min: 0 }
  };
  const series = [{ name: plantId || "Plant", data: rows.map(r => r.totalKwh) }];

  return loading ? <Spinner/> : <Chart options={options} series={series} type="area" height={330} />;
}

function DayProfileChart({ plantId, day }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use the zero-filled sampler for a single day
  const fromIso = `${day}T00:00:00`;
  const toIso   = `${day}T23:59:59`;

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      // /range-sampled returns GenerationPoint [{time, acPower, dcPower, ...}]
      const { data } = await API.get("/generation/range-sampled", {
        params: { from: fromIso, to: toIso, stepMinutes: 15, plantId },
        signal,
      });
      setRows(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  }, [plantId, fromIso, toIso]);

  useEffect(() => {
    if (!plantId || !day) return;
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [plantId, day, load]);

  const ac = rows.map(p => ({ x: parseLocal(p.time), y: Number(p.acPower ?? 0) }));
  const dc = rows.map(p => ({ x: parseLocal(p.time), y: Number(p.dcPower ?? 0) }));

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

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      // /health returns [{day, intervals, nonZero, uptimePct}]
      const { data } = await API.get("/generation/health", { params: { plantId, from, to }, signal });
      const arr = Array.isArray(data) ? data : [];
      setRows(arr);
    } finally { setLoading(false); }
  }, [from, to, plantId]);

  useEffect(() => {
    if (!from || !to || !plantId) return;
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [from, to, plantId, load]);

  const categories = rows.map(r => r.day);
  const series = [{ name: "Intervals", data: rows.map(r => r.intervals) }];

  const options = {
    chart: { type: "bar", height: 330, toolbar: { show: false } },
    xaxis: { categories },
    yaxis: { title: { text: "Intervals (max 96)" }, min: 0, max: 96 },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) => {
          const r = rows[dataPointIndex];
          if (!r) return val;
          return `${val} intervals • ${r.uptimePct?.toFixed(1) ?? 0}% uptime`;
        }
      }
    }
  };

  return loading ? <Spinner/> : <Chart options={options} series={series} type="bar" height={330} />;
}
