
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, TrendingUp } from "lucide-react";
import { InsightMetric } from "@/services/insightsService";

interface MetricCardProps {
  metric: InsightMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{metric.name}</h3>
          <div 
            className={`flex items-center gap-1 text-xs font-medium ${
              metric.status === "positive" 
                ? "text-green-500" 
                : metric.status === "negative" 
                ? "text-red-500" 
                : "text-gray-500"
            }`}
          >
            {metric.change !== undefined && (
              <>
                {metric.change > 0 ? "+" : ""}{metric.change}%
                {metric.status === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : metric.status === "negative" ? (
                  <TrendingUp className="h-3 w-3 rotate-180" />
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{metric.value}</span>
          {metric.description && (
            <div className="tooltip" data-tip={metric.description}>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
