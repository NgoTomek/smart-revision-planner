/**
 * Smart Revision Planner - Schedule Generator
 * 
 * This module contains the core algorithm for generating personalized revision timetables
 * based on subject confidence levels, exam dates, and weekly availability.
 */

/**
 * Calculate priority score for each subject based on confidence level and deadline
 * @param {Array} subjects - Array of subject objects with name, confidenceLevel, and examDate
 * @returns {Array} - Subjects with priority scores
 */
const calculateSubjectPriorities = (subjects) => {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  
  return subjects.map(subject => {
    const examDate = new Date(subject.examDate);
    const daysUntilExam = Math.max(1, Math.ceil((examDate - now) / oneDay));
    
    // Inverse confidence (1-5 scale becomes 5-1)
    // Lower confidence = higher priority
    const confidenceFactor = 6 - subject.confidenceLevel;
    
    // Calculate urgency factor based on days until exam
    // Closer exam = higher priority
    const urgencyFactor = 100 / daysUntilExam;
    
    // Combined priority score
    const priorityScore = (confidenceFactor * 0.6) + (urgencyFactor * 0.4);
    
    return {
      ...subject,
      daysUntilExam,
      priorityScore
    };
  });
};

/**
 * Calculate total weekly study time in minutes
 * @param {Object} availability - Weekly availability object
 * @returns {Number} - Total minutes available per week
 */
const calculateTotalAvailableTime = (availability) => {
  return Object.values(availability).reduce(
    (total, { hours, minutes }) => total + (hours * 60) + minutes,
    0
  );
};

/**
 * Allocate study time for each subject based on priority scores
 * @param {Array} subjectsWithPriority - Subjects with calculated priority scores
 * @param {Number} totalMinutesAvailable - Total available study time in minutes
 * @returns {Array} - Subjects with allocated study time in minutes
 */
const allocateStudyTime = (subjectsWithPriority, totalMinutesAvailable) => {
  // Calculate sum of all priority scores
  const totalPriorityScore = subjectsWithPriority.reduce(
    (sum, subject) => sum + subject.priorityScore,
    0
  );
  
  // Allocate time proportionally based on priority scores
  return subjectsWithPriority.map(subject => {
    const proportion = subject.priorityScore / totalPriorityScore;
    const allocatedMinutes = Math.round(totalMinutesAvailable * proportion);
    
    return {
      ...subject,
      allocatedMinutes
    };
  });
};

/**
 * Create daily schedule based on subject allocations and availability
 * @param {Array} subjectsWithAllocation - Subjects with allocated study time
 * @param {Object} availability - Weekly availability object
 * @returns {Object} - Daily schedule with study sessions
 */
const createDailySchedule = (subjectsWithAllocation, availability) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Convert availability to minutes per day
  const dailyAvailability = {};
  for (const day in availability) {
    dailyAvailability[day] = (availability[day].hours * 60) + availability[day].minutes;
  }
  
  // Create empty schedule
  const schedule = daysOfWeek.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});
  
  // Sort subjects by priority (highest first)
  const sortedSubjects = [...subjectsWithAllocation].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );
  
  // Track remaining minutes for each subject
  const remainingMinutes = {};
  sortedSubjects.forEach(subject => {
    remainingMinutes[subject.name] = subject.allocatedMinutes;
  });
  
  // Distribute study sessions across the week
  // First pass: allocate high priority subjects to days with most availability
  const sortedDays = [...daysOfWeek].sort(
    (a, b) => dailyAvailability[b] - dailyAvailability[a]
  );
  
  // Minimum session length in minutes (to avoid too short sessions)
  const MIN_SESSION_LENGTH = 30;
  
  // Maximum sessions per day (to avoid overloading)
  const MAX_SESSIONS_PER_DAY = 3;
  
  // First pass: allocate high priority subjects
  sortedSubjects.forEach(subject => {
    if (remainingMinutes[subject.name] <= 0) return;
    
    sortedDays.forEach(day => {
      // Skip if day is full
      if (schedule[day].length >= MAX_SESSIONS_PER_DAY) return;
      
      // Skip if not enough time available
      if (dailyAvailability[day] < MIN_SESSION_LENGTH) return;
      
      // Calculate session length (min of remaining subject time, available time, or 60 min)
      const sessionLength = Math.min(
        remainingMinutes[subject.name],
        dailyAvailability[day],
        60 // Cap at 60 minutes per session for better focus
      );
      
      if (sessionLength >= MIN_SESSION_LENGTH) {
        // Add session to schedule
        schedule[day].push({
          subject: subject.name,
          duration: sessionLength,
          confidenceLevel: subject.confidenceLevel
        });
        
        // Update remaining time
        remainingMinutes[subject.name] -= sessionLength;
        dailyAvailability[day] -= sessionLength;
      }
    });
  });
  
  // Second pass: distribute remaining time
  sortedSubjects.forEach(subject => {
    if (remainingMinutes[subject.name] <= 0) return;
    
    daysOfWeek.forEach(day => {
      // Skip if day is full
      if (schedule[day].length >= MAX_SESSIONS_PER_DAY) return;
      
      // Skip if not enough time available
      if (dailyAvailability[day] < MIN_SESSION_LENGTH) return;
      
      // Calculate session length
      const sessionLength = Math.min(
        remainingMinutes[subject.name],
        dailyAvailability[day],
        60
      );
      
      if (sessionLength >= MIN_SESSION_LENGTH) {
        // Add session to schedule
        schedule[day].push({
          subject: subject.name,
          duration: sessionLength,
          confidenceLevel: subject.confidenceLevel
        });
        
        // Update remaining time
        remainingMinutes[subject.name] -= sessionLength;
        dailyAvailability[day] -= sessionLength;
      }
    });
  });
  
  // Final pass: try to allocate any remaining time (even if shorter sessions)
  sortedSubjects.forEach(subject => {
    if (remainingMinutes[subject.name] <= 0) return;
    
    daysOfWeek.forEach(day => {
      if (remainingMinutes[subject.name] <= 0) return;
      if (dailyAvailability[day] <= 0) return;
      
      const sessionLength = Math.min(
        remainingMinutes[subject.name],
        dailyAvailability[day]
      );
      
      if (sessionLength > 0) {
        // Try to add to existing session for this subject
        const existingSession = schedule[day].find(s => s.subject === subject.name);
        
        if (existingSession) {
          existingSession.duration += sessionLength;
        } else if (schedule[day].length < MAX_SESSIONS_PER_DAY) {
          // Or create new session if there's room
          schedule[day].push({
            subject: subject.name,
            duration: sessionLength,
            confidenceLevel: subject.confidenceLevel
          });
        }
        
        // Update remaining time
        remainingMinutes[subject.name] -= sessionLength;
        dailyAvailability[day] -= sessionLength;
      }
    });
  });
  
  // Convert minutes to hours and minutes format for display
  for (const day in schedule) {
    schedule[day] = schedule[day].map(session => ({
      ...session,
      hours: Math.floor(session.duration / 60),
      minutes: session.duration % 60
    }));
  }
  
  return schedule;
};

/**
 * Generate a complete revision timetable
 * @param {Array} subjects - Array of subject objects
 * @param {Object} availability - Weekly availability object
 * @returns {Object} - Complete timetable with schedule and metadata
 */
export const generateTimetable = (subjects, availability) => {
  // Calculate subject priorities
  const subjectsWithPriority = calculateSubjectPriorities(subjects);
  
  // Calculate total available study time
  const totalMinutesAvailable = calculateTotalAvailableTime(availability);
  
  // Allocate study time for each subject
  const subjectsWithAllocation = allocateStudyTime(
    subjectsWithPriority,
    totalMinutesAvailable
  );
  
  // Create daily schedule
  const dailySchedule = createDailySchedule(subjectsWithAllocation, availability);
  
  // Calculate statistics for the timetable
  const totalAllocatedTime = subjectsWithAllocation.reduce(
    (sum, subject) => sum + subject.allocatedMinutes,
    0
  );
  
  const subjectBreakdown = subjectsWithAllocation.map(subject => ({
    name: subject.name,
    confidenceLevel: subject.confidenceLevel,
    examDate: subject.examDate,
    allocatedHours: Math.floor(subject.allocatedMinutes / 60),
    allocatedMinutes: subject.allocatedMinutes % 60,
    percentage: Math.round((subject.allocatedMinutes / totalAllocatedTime) * 100)
  }));
  
  // Return complete timetable
  return {
    dailySchedule,
    subjectBreakdown,
    totalStudyHours: Math.floor(totalAllocatedTime / 60),
    totalStudyMinutes: totalAllocatedTime % 60,
    generatedDate: new Date().toISOString()
  };
};

export default generateTimetable;
