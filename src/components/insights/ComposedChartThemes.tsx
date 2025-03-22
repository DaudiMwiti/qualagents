
import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ComposedChartThemesProps {
  data: any[];
}

export const ComposedChartThemes: React.FC<ComposedChartThemesProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    subthemes: item.children?.length || 0
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" name="Weight" barSize={60} fill="#8B5CF6" />
        <Line type="monotone" dataKey="subthemes" name="Subthemes" stroke="#22D3EE" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
