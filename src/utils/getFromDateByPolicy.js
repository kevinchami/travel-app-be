import { subDays, subWeeks, subMonths } from 'date-fns';

/**
 * Devuelve la fecha límite desde la cual empezar a contar
 * según la política de generación de cupones
 * @param {'daily' | 'weekly' | 'monthly'} policy
 * @returns {Date}
 */
export const getFromDateByPolicy = (policy = 'daily') => {
  const now = new Date();

  switch (policy) {
    case 'weekly':
      return subWeeks(now, 1);
    case 'monthly':
      return subMonths(now, 1);
    case 'daily':
    default:
      return subDays(now, 1);
  }
};
