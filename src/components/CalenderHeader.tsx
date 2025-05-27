import React from 'react';
import { formatDate } from '../utils/DateUtils';
import './CalenderHeader.css';
interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
      <div className="calendar-header">
      <h2 className="calendar-header-title">
        {formatDate(currentDate, 'MMMM yyyy')}
      </h2>
      <div className="calendar-header-buttons">
        <button onClick={onPrevMonth} className="calendar-header-button">
          ←
        </button>
        <button onClick={onNextMonth} className="calendar-header-button">
          →
        </button>
      </div>
    </div>
    );
};