// src/pages/RateChart.jsx
import { useEffect, useMemo, useState } from "react";
import { Box, Heading, HStack, Select, Spinner, Text } from "@chakra-ui/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import API from "../api"; // adjust if your api file is elsewhere

function toChartData(periods) {
  if (!periods?.length) return [];
  const sorted = [...periods].sort(
    (a, b) => (a.start ?? "00:00:00").localeCompare(b.start ?? "00:00:00")
  );
  const data = sorted.map(p => ({ time: (p.start ?? "00:00:00").slice(0,5), rate: Number(p.rate) }));
  const last = sorted[sorted.length - 1];
  data.push({ time: (last.end ?? "24:00:00").slice(0,5), rate: Number(last.rate) });
  return data;
}

export default function RateChart() {
  const [day, setDay] = useState("WEEKDAY");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get("/rates", { params: { plan: "TOU", dayType: day } })
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [day]);

  const chartData = useMemo(() => toChartData(data), [data]);

  return (
    <Box p={6} bg="white" _dark={{ bg: "gray.800" }} rounded="xl" shadow="md">
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Time-of-Use Rates</Heading>
        <Select value={day} onChange={e => setDay(e.target.value)} maxW="40">
          <option value="WEEKDAY">Weekday</option>
          <option value="WEEKEND">Weekend</option>
        </Select>
      </HStack>

      {loading ? (
        <HStack><Spinner /><Text>Loading rates…</Text></HStack>
      ) : (
        <Box h="320px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, "auto"]} tickFormatter={(v)=>v.toFixed(2)} />
              <Tooltip formatter={(v)=>`${Number(v).toFixed(2)} $/kWh`} />
              <Line type="stepAfter" dataKey="rate" stroke="#2b6cb0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}
