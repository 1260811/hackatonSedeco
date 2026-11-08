import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (iso: string): string => {
  try {
    return format(parseISO(iso), "d 'de' MMMM yyyy", { locale: es });
  } catch {
    return iso;
  }
};

export const formatDateTime = (iso: string): string => {
  try {
    return format(parseISO(iso), "d MMM yyyy, HH:mm", { locale: es });
  } catch {
    return iso;
  }
};

export const formatRelative = (iso: string): string => {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: es });
  } catch {
    return iso;
  }
};
