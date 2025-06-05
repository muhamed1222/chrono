import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format a Date into an ISO string while keeping the local time zone offset.
 * We avoid Date.toISOString() here because it converts the date to UTC.
 * By using `formatInTimeZone` we preserve the given zone (defaults to the
 * current environment's zone) in the resulting string.
 */
export const formatLocalISO = (
  date: Date,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): string => {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};
