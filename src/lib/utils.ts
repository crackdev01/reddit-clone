import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHourBetweenDate(from: Date, to: Date): string {
  const timeDiff: number = Math.abs(to.getTime() - from.getTime());
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  if (Math.floor(hoursDiff) < 24) {
    return `${Math.floor(hoursDiff)} hours ago`;
  } else {
    const daysDiff = Math.floor(hoursDiff) / 24;
    return `${Math.floor(daysDiff)} days ago`;
  }
}
