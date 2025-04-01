import React, { useState } from 'react';
import SubjectInput from './components/SubjectInput';
import SubjectList from './components/SubjectList';
import WeeklyAvailability from './components/WeeklyAvailability';
import FormSubmission from './components/FormSubmission';
import TimetableView from './components/TimetableView';
import AdjustmentControls from './components/AdjustmentControls';
import { generateTimetable } from './utils/scheduleGenerator';

function App() {
  const [subjects, setSubjects] = useState([]);
  const [availability, setAvailability] = useState({});
  const [timetable, setTimetable] = useState(null);
  const [lockedDays, setLockedDays] = useState({});
  
  const handleAddSubject = (newSubject) => {
    setSubjects([...subjects, newSubject]);
  };
  
  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
    
    // Regenerate timetable if it exists
    if (timetable && updatedSubjects.length > 0) {
      const newTimetable = generateTimetable(updatedSubjects, availability);
      setTimetable(newTimetable);
    } else if (updatedSubjects.length === 0) {
      setTimetable(null);
    }
  };
  
  const handleUpdateAvailability = (newAvailability) => {
    setAvailability(newAvailability);
    
    // Regenerate timetable if it exists
    if (timetable && subjects.length > 0) {
      const newTimetable = generateTimetable(subjects, newAvailability);
      setTimetable(newTimetable);
    }
  };
  
  const handleSubmit = (formData) => {
    const newTimetable = generateTimetable(formData.subjects, formData.availability);
    setTimetable(newTimetable);
  };
  
  const handleReschedule = () => {
    // Get today's day name
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    // Create a copy of the timetable
    const updatedTimetable = JSON.parse(JSON.stringify(timetable));
    
    // Get sessions from today
    const todaySessions = updatedTimetable.dailySchedule[today] || [];
    
    // Remove today's sessions
    updatedTimetable.dailySchedule[today] = [];
    
    // Get available days (excluding today and locked days)
    const availableDays = Object.keys(updatedTimetable.dailySchedule).filter(
      day => day !== today && !lockedDays[day]
    );
    
    if (availableDays.length === 0 || todaySessions.length === 0) {
      // No available days or no sessions to reschedule
      return;
    }
    
    // Redistribute sessions
    todaySessions.forEach((session, index) => {
      // Distribute sessions evenly across available days
      const targetDay = availableDays[index % availableDays.length];
      updatedTimetable.dailySchedule[targetDay].push(session);
    });
    
    // Update timetable
    setTimetable(updatedTimetable);
  };
  
  const handleToggleLock = (day) => {
    setLockedDays(prev => {
      const updated = { ...prev, [day]: !prev[day] };
      
      // If we're locking a day, reschedule its sessions
      if (updated[day] && timetable && timetable.dailySchedule[day]?.length > 0) {
        const updatedTimetable = JSON.parse(JSON.stringify(timetable));
        
        // Get sessions from the locked day
        const lockedDaySessions = updatedTimetable.dailySchedule[day] || [];
        
        // Remove locked day's sessions
        updatedTimetable.dailySchedule[day] = [];
        
        // Get available days (excluding locked days)
        const availableDays = Object.keys(updatedTimetable.dailySchedule).filter(
          d => !updated[d]
        );
        
        if (availableDays.length > 0 && lockedDaySessions.length > 0) {
          // Redistribute sessions
          lockedDaySessions.forEach((session, index) => {
            // Distribute sessions evenly across available days
            const targetDay = availableDays[index % availableDays.length];
            updatedTimetable.dailySchedule[targetDay].push(session);
          });
          
          // Update timetable
          setTimetable(updatedTimetable);
        }
      }
      
      return updated;
    });
  };
  
  const handleReset = () => {
    setTimetable(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Smart Revision Planner</h1>
          <p className="mt-2">Build your personalized study timetable</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!timetable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SubjectInput onAddSubject={handleAddSubject} />
                <SubjectList 
                  subjects={subjects} 
                  onRemoveSubject={handleRemoveSubject} 
                />
              </div>
              <div>
                <WeeklyAvailability onUpdateAvailability={handleUpdateAvailability} />
                <FormSubmission 
                  subjects={subjects}
                  availability={availability}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          ) : (
            <div>
              <TimetableView timetable={timetable} />
              <AdjustmentControls 
                onReschedule={handleReschedule}
                onToggleLock={handleToggleLock}
                lockedDays={lockedDays}
              />
              <div className="mt-6 text-center">
                <button
                  onClick={handleReset}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back to Input Form
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Smart Revision Planner &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
