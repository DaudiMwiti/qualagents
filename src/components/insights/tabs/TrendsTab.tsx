
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { ProjectInsights } from "@/services/insightsService";

interface TrendsTabProps {
  insights: ProjectInsights;
  colors: string[];
}

export const TrendsTab: React.FC<TrendsTabProps> = ({ insights, colors }) => {
  return (
    <div className="m-0">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="flex justify-between items-center">
              <span>Trend Analysis Over Time</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={insights.trends}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Array.from(new Set(insights.trends.map(item => item.category))).map((category, index) => (
                  <Line
                    key={String(category)}
                    type="monotone"
                    dataKey="value"
                    name={String(category)}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                    data={insights.trends.filter(item => item.category === category)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Growth Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={insights.trends.filter(t => t.category === insights.categories[0]?.name)}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
