import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { generateCalendarDays, isPastDate } from '../utils/DateUtils';
import { generateEventId } from '../utils/EventUtils';
import { generateRecurringDates, isRecurringEvent } from '../utils/recurrence';
import { CalendarHeader } from './CalenderHeader';
import { WeekdayHeader } from './WeekdayHeader';
import { CalendarDay } from './CalenderDay';
import { EventList } from './EventList';
import { EventModal } from './EventModal';
import { CalendarEvent, EventFormData } from '../types';
import './Calender.css';
export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handlePrevMonth = () => {
    setCurrentDate((date) => subMonths(date, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((date) => addMonths(date, 1));
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  const handleEventSubmit = (formData: EventFormData) => {
    if (editingEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingEvent.id
            ? { ...event, ...formData }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: generateEventId(),
        date: selectedDate!,
        ...formData,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setIsModalOpen(false);
  };

  const calendarDays = generateCalendarDays(currentDate);
  const selectedDateEvents = selectedDate
    ? events.filter(
        (event) =>
          event.date.toDateString() === selectedDate.toDateString() ||
          (event.isRecurring && isRecurringEvent(selectedDate, event))
      )
    : [];

  return (
  <div>
    <h1 className="page-heading">Welcome to Your Calendar Guide</h1>
    <div className="calendar-container">
      {/* Remove this block:
        <div className="calendar-sidebar"> 
          <h1 className="calendar-title">Welcome to You Calender Guide</h1>
          <ul className="calendar-list"></ul>
        </div>
      */}
      <div className="calendar-main">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <div className="calendar-main-content">
          <WeekdayHeader />
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <CalendarDay
                key={day.toISOString()}
                date={day}
                baseDate={currentDate}
                events={events}
                onSelectDate={setSelectedDate}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="calendar-sidebar-panel">
        <div className="calendar-panel-content">
          <div className="calendar-panel-header">
            <h3 className="calendar-panel-title">
              {selectedDate ? (
                <>Events for {selectedDate.toLocaleDateString()}</>
              ) : (
                'Select a date to manage events'
              )}
            </h3>
          </div>
          {selectedDate && (
            <>
              <button
                onClick={handleAddEvent}
                className="calendar-add-button"
              >
                Add Event
              </button>
              <EventList
                events={selectedDateEvents}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                isPastDate={isPastDate(selectedDate!)}
              />
            </>
          )}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEventSubmit}
        initialData={
          editingEvent
            ? {
                title: editingEvent.title,
                description: editingEvent.description || '',
                color: editingEvent.color || '#3B82F6',
                isRecurring: editingEvent.isRecurring || false,
                recurrence: editingEvent.recurrence,
              }
            : undefined
        }
        title={editingEvent ? 'Edit Event' : 'Add Event'}
      />
    </div>
  </div>

  );
};