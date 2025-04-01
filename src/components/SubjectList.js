import React, { useState } from 'react';

const SubjectList = ({ subjects, onRemoveSubject }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Subjects</h2>
      {subjects.length === 0 ? (
        <p className="text-gray-500 italic">No subjects added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {subjects.map((subject, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{subject.name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star}
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${subject.confidenceLevel >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    Exam: {new Date(subject.examDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveSubject(index)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubjectList;
