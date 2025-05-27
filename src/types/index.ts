export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time?: string;
  color?: string;
  recurrence?: RecurrenceRule;
  isRecurring?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  time?: string;
  color: string;
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
}