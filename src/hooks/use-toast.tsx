
import React from "react";
import {
  toast as sonnerToast,
  ToastT,
} from "sonner";

// Fix the type definition to make id optional
export type ToastProps = Partial<Omit<ToastT, "description">> & {
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
  onOpenChange?: (open: boolean) => void;
};

export function toast({
  variant = "default",
  onOpenChange,
  ...props
}: ToastProps) {
  const defaultStyle = {};
  
  const variantStyles: Record<string, object> = {
    destructive: {
      style: {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
    },
    success: {
      style: {
        backgroundColor: "hsl(var(--success, 142 71% 45%))",
        color: "hsl(var(--success-foreground, 0 0% 98%))",
      },
    },
    info: {
      style: {
        backgroundColor: "hsl(var(--info, 221 83% 53%))",
        color: "hsl(var(--info-foreground, 0 0% 98%))",
      },
    },
    warning: {
      style: {
        backgroundColor: "hsl(var(--warning, 38 92% 50%))",
        color: "hsl(var(--warning-foreground, 0 0% 98%))",
      },
    },
  };

  const styleConfig = variant !== "default" ? variantStyles[variant] || {} : defaultStyle;

  return sonnerToast.custom(
    (id) => (
      <div>
        <h3 className="font-medium">{props.title}</h3>
        {props.description && <p className="text-sm">{props.description}</p>}
      </div>
    ),
    {
      ...props,
      ...styleConfig,
      onAutoClose: onOpenChange ? () => onOpenChange(false) : undefined,
      onDismiss: onOpenChange ? () => onOpenChange(false) : undefined,
    },
  );
}

export const useToast = () => {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
    error: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    success: (message: string) => {
      toast({
        title: "Success",
        description: message,
        variant: "success",
      });
    },
    info: (message: string) => {
      toast({
        title: "Info",
        description: message,
        variant: "info",
      });
    },
    warning: (message: string) => {
      toast({
        title: "Warning", 
        description: message,
        variant: "warning",
      });
    },
  };
};

export default useToast;
