import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @typedef {import("clsx").ClassValue} ClassValue
 */

/**
 * Tailwind + clsx 머지 유틸리티
 * @param {...ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
