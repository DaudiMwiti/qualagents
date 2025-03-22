
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Brain, CalendarDays, Star, ThumbsUp, MessageSquare } from "lucide-react";
import { ProjectInsights } from "@/services/insightsService";

interface InsightsTabProps {
  insights: ProjectInsights;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ insights }) => {
  return (
    <div className="m-0">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="flex justify-between items-center">
              <span>All Insights</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter by Agent
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {insights.topInsights.map((insight) => (
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
                        <Star className="h-3 w-3 mr-1" />
                        <span>Relevance: {insight.relevance}%</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Validate
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Discuss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
