# Smart Revision Planner

A React application that helps students automatically build a personalized revision timetable based on their subjects, confidence levels, exam dates, and weekly availability.

## Features

### Core Features
- **User Inputs**
  - Subject entry with confidence level selection (1-5 stars)
  - Exam dates/deadlines input
  - Weekly availability scheduler
  - Form validation and submission

- **Schedule Generator**
  - Allocates more time to subjects with lower confidence levels
  - Prioritizes subjects with sooner deadlines
  - Creates balanced daily workloads
  - Distributes topics throughout the week

- **Timetable Output**
  - Visual calendar with color-coding by subject
  - Daily task list view
  - Subject breakdown with statistics

- **Adjustment Features**
  - "I didn't study today" rescheduling functionality
  - Day locking/unlocking capability

## Technologies Used
- React
- Tailwind CSS
- Firebase Hosting

## Installation and Setup

1. Clone the repository:
```
git clone https://github.com/NgoTomek/smart-revision-planner.git
cd smart-revision-planner
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Build for production:
```
npm run build
```

## Deployment

The application is configured for Firebase Hosting deployment. To deploy:

1. Install Firebase CLI:
```
npm install -g firebase-tools
```

2. Login to Firebase:
```
firebase login
```

3. Initialize Firebase (if not already done):
```
firebase init
```

4. Deploy to Firebase:
```
firebase deploy
```

## IAM Permissions for Logging

For proper logging functionality, add the following service account principals with the "Log Writer" role:

1. Firebase Hosting service account: `firebase-hosting@system.gserviceaccount.com`
2. App Engine default service account: `[PROJECT-ID]@appspot.gserviceaccount.com`
3. Cloud Build service account: `[PROJECT-NUMBER]@cloudbuild.gserviceaccount.com`

These service accounts need the "Logs Writer" (roles/logging.logWriter) IAM role to properly write logs to Cloud Logging.

## Project Structure

- `/src/components` - React components
- `/src/utils` - Utility functions including the schedule generator algorithm
- `/public` - Static assets
- `/build` - Production build (generated after running `npm run build`)

## License

This project is licensed under the MIT License.
