import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Conditionally joins class names together.
 * 
 * @param inputs - Class names to join
 * @returns The joined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Conditionally joins class names together with a base class.
 * 
 * @param base - The base class name
 * @param inputs - Class names to join
 * @returns The joined class names
 */
export function cnBase(base: string, ...inputs: ClassValue[]) {
  return twMerge(base, clsx(inputs))
}

/**
 * Conditionally joins class names together with a base class and a suffix.
 * 
 * @param base - The base class name
 * @param suffix - The suffix to append to the base class
 * @param inputs - Class names to join
 * @returns The joined class names
 */
export function cnBaseSuffix(base: string, suffix: string, ...inputs: ClassValue[]) {
  return twMerge(`${base}-${suffix}`, clsx(inputs))
}
