
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, FileEdit, AlertCircle, Loader2 } from "lucide-react";

export type StatusType = 'draft' | 'in-progress' | 'processing' | 'completed' | 'failed';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  processing?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  size = 'md',
  showLabel = true,
  className = "",
  processing = false
}) => {
  const getStatusConfig = () => {
    if (processing) {
      return {
        color: "bg-purple-500 hover:bg-purple-600",
        icon: <Loader2 className={`${getIconSize()} animate-spin`} />,
        label: "Processing"
      };
    }
    
    switch (status) {
      case 'draft':
        return {
          color: "bg-orange-200 text-orange-800 hover:bg-orange-300",
          icon: <FileEdit className={getIconSize()} />,
          label: "Draft"
        };
      case 'in-progress':
        return {
          color: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
          icon: <Clock className={getIconSize()} />,
          label: "In Progress"
        };
      case 'processing':
        return {
          color: "bg-purple-500 hover:bg-purple-600",
          icon: <Loader2 className={`${getIconSize()} animate-spin`} />,
          label: "Processing"
        };
      case 'completed':
        return {
          color: "bg-green-500 hover:bg-green-600",
          icon: <CheckCircle2 className={getIconSize()} />,
          label: "Completed"
        };
      case 'failed':
        return {
          color: "bg-red-500 hover:bg-red-600",
          icon: <AlertCircle className={getIconSize()} />,
          label: "Failed"
        };
      default:
        return {
          color: "bg-gray-200 text-gray-800 hover:bg-gray-300",
          icon: <Clock className={getIconSize()} />,
          label: "Unknown"
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-0.5';
      case 'lg': return 'text-sm px-3 py-1.5';
      default: return 'text-xs px-2.5 py-1';
    }
  };

  const { color, icon, label } = getStatusConfig();

  return (
    <Badge 
      className={`font-medium ${color} ${getSizeClasses()} ${showLabel ? 'min-w-20' : ''} ${className}`}
    >
      {showIcon && <span className="mr-1">{icon}</span>}
      {showLabel && label}
    </Badge>
  );
};
