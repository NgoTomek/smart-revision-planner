import React from 'react';

const AdjustmentControls = ({ onReschedule, onToggleLock, lockedDays = {} }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Adjust Your Timetable</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Missed Study Sessions</h3>
        <button
          onClick={onReschedule}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          I Didn't Study Today - Reschedule
        </button>
        <p className="mt-2 text-sm text-gray-500">
          This will redistribute today's missed study sessions across the rest of your week.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700">Lock/Unlock Days</h3>
        <p className="text-sm text-gray-500 mb-3">
          Lock days when you know you won't be able to study (e.g., due to other commitments).
        </p>
        
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => onToggleLock(day)}
              className={`p-2 text-center rounded-md border ${
                lockedDays[day] 
                  ? 'bg-gray-200 border-gray-400 text-gray-500' 
                  : 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="text-xs">{day.substring(0, 3)}</div>
              <div className="mt-1">
                {lockedDays[day] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdjustmentControls;
