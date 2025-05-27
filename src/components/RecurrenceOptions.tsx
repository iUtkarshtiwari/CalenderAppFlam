import React, { useState } from 'react';
import { RecurrenceFrequency, RecurrenceRule } from '../types';

interface RecurrenceOptionsProps {
  onChange: (recurrence: RecurrenceRule | undefined) => void;
  initialValue?: RecurrenceRule;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({ onChange, initialValue }) => {
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(initialValue?.frequency || 'daily');
  const [interval, setInterval] = useState<number>(initialValue?.interval || 1);
  const [selectedDays, setSelectedDays] = useState<number[]>(initialValue?.daysOfWeek || []);
  const [dayOfMonth, setDayOfMonth] = useState<number>(initialValue?.dayOfMonth || 1);
  const [endDate, setEndDate] = useState<string>(initialValue?.endDate?.toISOString().split('T')[0] || '');

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleFrequencyChange = (newFrequency: RecurrenceFrequency) => {
    setFrequency(newFrequency);
    updateRecurrenceRule(newFrequency);
  };

  const handleDayToggle = (day: number) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newSelectedDays);
    updateRecurrenceRule(frequency, newSelectedDays);
  };

  const updateRecurrenceRule = (
    newFrequency: RecurrenceFrequency = frequency,
    newSelectedDays: number[] = selectedDays
  ) => {
    const rule: RecurrenceRule = {
      frequency: newFrequency,
      interval: newFrequency === 'custom' ? interval : undefined,
      daysOfWeek: newFrequency === 'weekly' ? newSelectedDays : undefined,
      dayOfMonth: newFrequency === 'monthly' ? dayOfMonth : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    onChange(rule);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Frequency</label>
        <select
          value={frequency}
          onChange={(e) => handleFrequencyChange(e.target.value as RecurrenceFrequency)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Days of Week</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                onClick={() => handleDayToggle(day.value)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedDays.includes(day.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequency === 'monthly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Day of Month</label>
          <input
            type="number"
            min="1"
            max="31"
            value={dayOfMonth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setDayOfMonth(value);
              updateRecurrenceRule();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      {frequency === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Repeat every</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={interval}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setInterval(value);
                updateRecurrenceRule();
              }}
              className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-500">weeks</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            updateRecurrenceRule();
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default RecurrenceOptions; 