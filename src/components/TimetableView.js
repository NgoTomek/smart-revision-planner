import React from 'react';

const TimetableView = ({ timetable }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Color mapping for confidence levels (1-5)
  const getSubjectColor = (confidenceLevel) => {
    const colors = [
      'bg-red-100 border-red-300 text-red-800',      // Level 1 (Weak)
      'bg-orange-100 border-orange-300 text-orange-800', // Level 2
      'bg-yellow-100 border-yellow-300 text-yellow-800', // Level 3
      'bg-blue-100 border-blue-300 text-blue-800',   // Level 4
      'bg-green-100 border-green-300 text-green-800', // Level 5 (Strong)
    ];
    return colors[confidenceLevel - 1] || colors[2]; // Default to middle color if invalid
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Revision Timetable</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Weekly Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Study Sessions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {daysOfWeek.map((day) => (
                <tr key={day}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {day}
                  </td>
                  <td className="py-3 px-4">
                    {timetable.dailySchedule[day].length > 0 ? (
                      <div className="space-y-2">
                        {timetable.dailySchedule[day].map((session, index) => (
                          <div 
                            key={index}
                            className={`p-2 rounded-md border ${getSubjectColor(session.confidenceLevel)}`}
                          >
                            <div className="font-medium">{session.subject}</div>
                            <div className="text-sm">
                              {session.hours > 0 ? `${session.hours}h ` : ''}
                              {session.minutes > 0 ? `${session.minutes}m` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">No sessions scheduled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Subject Breakdown</h3>
        <div className="space-y-3">
          {timetable.subjectBreakdown.map((subject, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{subject.name}</span>
                <span className="text-sm text-gray-500">
                  {subject.allocatedHours}h {subject.allocatedMinutes}m ({subject.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    subject.confidenceLevel === 1 ? 'bg-red-600' :
                    subject.confidenceLevel === 2 ? 'bg-orange-500' :
                    subject.confidenceLevel === 3 ? 'bg-yellow-500' :
                    subject.confidenceLevel === 4 ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${subject.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Exam: {new Date(subject.examDate).toLocaleDateString()}</span>
                <span>
                  Confidence: {
                    subject.confidenceLevel === 1 ? 'Weak' :
                    subject.confidenceLevel === 2 ? 'Below Average' :
                    subject.confidenceLevel === 3 ? 'Average' :
                    subject.confidenceLevel === 4 ? 'Good' :
                    'Strong'
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total weekly study time:</span>
          <span className="font-bold text-blue-600">
            {timetable.totalStudyHours}h {timetable.totalStudyMinutes}m
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Timetable generated on {new Date(timetable.generatedDate).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TimetableView;
