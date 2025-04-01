import React, { useState } from 'react';

const WeeklyAvailability = ({ onUpdateAvailability }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [availability, setAvailability] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { hours: 0, minutes: 0 };
      return acc;
    }, {})
  );

  const handleHoursChange = (day, hours) => {
    const parsedHours = Math.min(Math.max(0, parseInt(hours) || 0), 24);
    setAvailability(prev => {
      const updated = {
        ...prev,
        [day]: { ...prev[day], hours: parsedHours }
      };
      onUpdateAvailability(updated);
      return updated;
    });
  };

  const handleMinutesChange = (day, minutes) => {
    const parsedMinutes = Math.min(Math.max(0, parseInt(minutes) || 0), 59);
    setAvailability(prev => {
      const updated = {
        ...prev,
        [day]: { ...prev[day], minutes: parsedMinutes }
      };
      onUpdateAvailability(updated);
      return updated;
    });
  };

  const getTotalHours = () => {
    return Object.values(availability).reduce(
      (total, { hours, minutes }) => total + hours + minutes / 60, 
      0
    ).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Weekly Availability</h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter how much time you can dedicate to studying on each day of the week.
      </p>
      
      <div className="space-y-4">
        {daysOfWeek.map(day => (
          <div key={day} className="flex items-center justify-between">
            <span className="w-24 font-medium text-gray-700">{day}</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={availability[day].hours}
                  onChange={(e) => handleHoursChange(day, e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-1 text-gray-700">hrs</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={availability[day].minutes}
                  onChange={(e) => handleMinutesChange(day, e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-1 text-gray-700">min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total weekly study time:</span>
          <span className="font-bold text-blue-600">{getTotalHours()} hours</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyAvailability;
