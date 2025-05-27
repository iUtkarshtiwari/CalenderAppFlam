import React from 'react';
import clsx from 'clsx';
import { formatDate, isCurrentMonth, isCurrentDay } from '../utils/DateUtils';
import { CalendarEvent } from '../types';
import { getEventsForDate } from '../utils/EventUtils';
import { isRecurringEvent } from '../utils/recurrence';

interface CalendarDayProps {
  date: Date;
  baseDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  baseDate,
  events,
  onSelectDate,
}) => {
  const isThisMonth = isCurrentMonth(date, baseDate);
  const isToday = isCurrentDay(date);
  const dayEvents = events.filter(event => 
    event.date.toDateString() === date.toDateString() || 
    (event.isRecurring && isRecurringEvent(date, event))
  );

  const recurringEvents = dayEvents.filter(event => event.isRecurring);
  const regularEvents = dayEvents.filter(event => !event.isRecurring);

  return (
    <button
      onClick={() => onSelectDate(date)}
      className={clsx(
        'w-full aspect-square flex flex-col items-stretch p-1 rounded-lg',
        'hover:bg-gray-100 transition-colors relative group',
        {
          'text-gray-400': !isThisMonth,
          'text-gray-900': isThisMonth,
          'bg-blue-500': isToday,
          'text-white': isToday,
        }
      )}
    >
      <span
        className={clsx('text-sm self-center mb-1', {
          'font-semibold': isToday,
        })}
      >
        {formatDate(date, 'd')}
      </span>
      
      {recurringEvents.length > 0 && (
        <div className="flex flex-wrap gap-1 overflow-hidden">
          {recurringEvents.map((event) => (
            <div
              key={event.id}
              className="w-full h-2 rounded-full flex items-center"
              style={{ backgroundColor: event.color }}
            >
              <span className="text-[8px] text-white px-1">↻</span>
            </div>
          ))}
        </div>
      )}

      {regularEvents.length > 0 && (
        <div className="flex flex-wrap gap-1 overflow-hidden mt-1">
          {regularEvents.map((event) => (
            <div
              key={event.id}
              className="w-full h-2 rounded-full"
              style={{ backgroundColor: event.color }}
            />
          ))}
        </div>
      )}

      {dayEvents.length > 3 && (
        <span className="text-xs text-gray-500 mt-1">
          +{dayEvents.length - 3} more
        </span>
      )}
    </button>
  );
};