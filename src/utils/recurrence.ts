import { RecurrenceRule } from '../types';

export function generateRecurringDates(
  startDate: Date,
  rule: RecurrenceRule,
  endDate?: Date
): Date[] {
  const dates: Date[] = [startDate];
  const maxDate = rule.endDate || endDate || new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
  let currentDate = new Date(startDate);

  while (currentDate < maxDate) {
    switch (rule.frequency) {
      case 'daily':
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        break;

      case 'weekly':
        if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
          do {
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
          } while (!rule.daysOfWeek.includes(currentDate.getDay()));
        } else {
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
        }
        break;

      case 'monthly':
        if (rule.dayOfMonth) {
          const nextMonth = currentDate.getMonth() + 1;
          currentDate = new Date(currentDate.getFullYear(), nextMonth, rule.dayOfMonth);
        } else {
          currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        }
        break;

      case 'custom':
        if (rule.interval) {
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + (7 * rule.interval)));
        }
        break;
    }

    if (currentDate <= maxDate) {
      dates.push(new Date(currentDate));
    }
  }

  return dates;
}

export function isRecurringEvent(date: Date, event: { date: Date; recurrence?: RecurrenceRule }): boolean {
  if (!event.recurrence) return false;

  const recurringDates = generateRecurringDates(event.date, event.recurrence);
  return recurringDates.some(d => 
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
} 