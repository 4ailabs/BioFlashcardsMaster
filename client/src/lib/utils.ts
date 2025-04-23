import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: false,
    day: 'numeric',
    month: 'short'
  }).format(date);
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'bacteria':
      return 'bg-bacteria';
    case 'virus_adn':
      return 'bg-virus-adn';
    case 'virus_arn':
      return 'bg-virus-arn';
    case 'parasito':
      return 'bg-parasito';
    case 'hongo':
      return 'bg-hongo';
    default:
      return 'bg-primary';
  }
}

export function getCategoryTextColor(category: string): string {
  switch (category) {
    case 'bacteria':
      return 'text-bacteria';
    case 'virus_adn':
      return 'text-virus-adn';
    case 'virus_arn':
      return 'text-virus-arn';
    case 'parasito':
      return 'text-parasito';
    case 'hongo':
      return 'text-hongo';
    default:
      return 'text-primary';
  }
}

export function getCategoryHoverColor(category: string): string {
  switch (category) {
    case 'bacteria':
      return 'hover:bg-bacteria/10 dark:hover:bg-bacteria/20';
    case 'virus_adn':
      return 'hover:bg-virus-adn/10 dark:hover:bg-virus-adn/20';
    case 'virus_arn':
      return 'hover:bg-virus-arn/10 dark:hover:bg-virus-arn/20';
    case 'parasito':
      return 'hover:bg-parasito/10 dark:hover:bg-parasito/20';
    case 'hongo':
      return 'hover:bg-hongo/10 dark:hover:bg-hongo/20';
    default:
      return 'hover:bg-primary/10 dark:hover:bg-primary/20';
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'bacteria':
      return 'Bacterias';
    case 'virus_adn':
      return 'Virus ADN';
    case 'virus_arn':
      return 'Virus ARN';
    case 'parasito':
      return 'Parásitos';
    case 'hongo':
      return 'Hongos';
    default:
      return 'Desconocido';
  }
}

export function getStudyProgress(studied: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((studied / total) * 100);
}
