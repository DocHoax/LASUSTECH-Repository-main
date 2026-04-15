import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openMailto(address: string, subject: string) {
  const url = `mailto:${address}?subject=${encodeURIComponent(subject)}`;
  window.location.href = url;
}
