// lib/utils.ts
// Description: shadcn utility — merges Tailwind class names with tailwind-merge + clsx

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
