
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Button } from "@/components/ui/button";
import { Brain, CalendarDays, ThumbsUp, MessageSquare } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProjectInsights } from "@/services/insightsService";

interface OverviewTabProps {
  insights: ProjectInsights;
  colors: string[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ insights, colors }) => {
  return (
    <div className="m-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{
                primary: { theme: { light: "#8B5CF6", dark: "#A78BFA" } },
                secondary: { theme: { light: "#22D3EE", dark: "#67E8F9" } },
                tertiary: { theme: { light: "#10B981", dark: "#34D399" } },
                quaternary: { theme: { light: "#F59E0B", dark: "#FBBF24" } },
                quinary: { theme: { light: "#EF4444", dark: "#F87171" } },
              }}>
                <BarChart data={insights.categories} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" name="Count" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {insights.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {insights.topInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{insight.agentName}</span>
                          <Badge variant="outline" className="text-xs">
                            {insight.methodology}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {insight.date}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{insight.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>Relevance: {insight.relevance}%</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Discuss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => document.querySelector('[data-value="insights"]')?.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                )}>
                  View All Insights
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
