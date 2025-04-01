import React, { useState } from 'react';

const FormSubmission = ({ subjects, availability, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const validateForm = () => {
    if (subjects.length === 0) {
      setError('Please add at least one subject');
      return false;
    }
    
    const totalAvailableTime = Object.values(availability).reduce(
      (total, { hours, minutes }) => total + hours + minutes / 60, 
      0
    );
    
    if (totalAvailableTime < 1) {
      setError('Please add some weekly availability (at least 1 hour total)');
      return false;
    }
    
    setError('');
    return true;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call or processing time
    setTimeout(() => {
      onSubmit({ subjects, availability });
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className="mt-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Timetable...
          </span>
        ) : (
          'Generate My Revision Timetable'
        )}
      </button>
      
      <p className="mt-2 text-sm text-gray-500 text-center">
        Your timetable will be optimized based on your subject confidence levels and deadlines.
      </p>
    </div>
  );
};

export default FormSubmission;
