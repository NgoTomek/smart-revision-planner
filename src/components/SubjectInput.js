import React, { useState } from 'react';

const SubjectInput = ({ onAddSubject }) => {
  const [subject, setSubject] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [examDate, setExamDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject.trim() === '' || !examDate) return;
    
    onAddSubject({
      name: subject,
      confidenceLevel,
      examDate
    });
    
    // Reset form
    setSubject('');
    setConfidenceLevel(3);
    setExamDate('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Add Subject</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Name
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics, Physics"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confidence Level
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setConfidenceLevel(star)}
                className="focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-8 w-8 ${confidenceLevel >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {confidenceLevel === 1 ? 'Weak' : confidenceLevel === 2 ? 'Below Average' : 
               confidenceLevel === 3 ? 'Average' : confidenceLevel === 4 ? 'Good' : 'Strong'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-1">
            Exam Date / Deadline
          </label>
          <input
            type="date"
            id="examDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default SubjectInput;
