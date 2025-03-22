
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ComposedChartThemes } from "../ComposedChartThemes";
import { ProjectInsights } from "@/services/insightsService";

interface ThemesTabProps {
  insights: ProjectInsights;
}

export const ThemesTab: React.FC<ThemesTabProps> = ({ insights }) => {
  return (
    <div className="m-0">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Thematic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ComposedChartThemes data={insights.thematicClusters} />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.thematicClusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{cluster.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Weight</span>
                    <span className="text-sm font-medium">{cluster.value}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(cluster.value / Math.max(...insights.thematicClusters.map(c => c.value))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {cluster.children?.map((child) => (
                    <div key={child.id}>
                      <div className="flex justify-between text-sm">
                        <span>{child.name}</span>
                        <span>{child.value}</span>
                      </div>
                      <div className="h-1.5 bg-secondary/50 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-primary/60"
                          style={{
                            width: `${(child.value / cluster.value) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
