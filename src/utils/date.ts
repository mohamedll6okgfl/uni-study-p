/**
 * Formats an ISO date string (YYYY-MM-DD) into a human-readable format.
 * Example: "2025-12-15" -> "Dec 15, 2025"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns the number of calendar days between today and the target date string.
 * Positive = future, Negative = past, 0 = today.
 */
export function daysUntil(dateString: string): number {
  if (!dateString) return 0;
  
  // Set times to midnight to calculate pure calendar day difference
  const target = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a task is overdue.
 * True if the due date is before today and the status is not 'done'.
 */
export function isOverdue(dueDate: string, status: string): boolean {
  if (status === 'done') return false;
  return daysUntil(dueDate) < 0;
}

/**
 * Generates an array of 7 Date objects representing the week starting from the given date.
 */
export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(startDate);
  // Ensure we start at midnight local time
  start.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  
  return days;
}

/**
 * Gets the start of the week (Monday) for a given date.
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}
