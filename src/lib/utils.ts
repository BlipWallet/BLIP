import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 긴 주소를 짧게 줄여 표시합니다.
 * 예: 0x1234567890abcdef1234567890abcdef12345678 -> 0x1234...5678
 */
export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4
): string {
  if (!address) return "";

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
}
