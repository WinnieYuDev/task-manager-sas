import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const priorityColors: Record<string, string> = {
  high: "bg-strawberry/15 text-strawberry border-strawberry/30",
  medium: "bg-lemon/15 text-mango border-lemon/30",
  low: "bg-avocado/15 text-avocado border-avocado/30",
};

export const priorityChartColors = {
  high: "#E63946",
  medium: "#F4D35E",
  low: "#2A9D8F",
};
