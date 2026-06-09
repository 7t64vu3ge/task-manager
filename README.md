# Task Manager - React Native Application

## Project Overview

Task Manager is a robust, cross-platform mobile application built with React Native and Expo. It is designed to help users effortlessly manage their daily activities by offering comprehensive tools for tracking tasks, setting priorities, and analyzing productivity. Built with a focus on a clean, modern user interface and seamless user experience, the application ensures that all task data is persistently stored locally for instant access.

## Features

- **Authentication Flow:** Secure, mock login screen with persistent session management that keeps users authenticated across app restarts.
- **Task Management (CRUD):** 
  - Create new tasks with custom titles, descriptions, due dates, and priority levels.
  - Read and review your pending and completed tasks.
  - Update and edit existing task details.
  - Delete tasks securely with confirmation prompts to prevent accidental data loss.
- **Advanced Searching, Filtering & Sorting:**
  - Instantly search tasks by title.
  - Filter the dashboard by Task Status (Pending/Completed) and Priority (High/Medium/Low).
  - Sort your tasks dynamically by Due Date (Earliest first or Latest first).
- **Statistics Dashboard:** Gain insights into your productivity with real-time metrics including total tasks, completion rates, pending tasks, and high-priority alerts.
- **Local Persistence:** Data is reliably stored on the device using `AsyncStorage`, guaranteeing rapid load times and offline availability.
- **Pull-to-Refresh:** Smooth, native pull-to-refresh capabilities to quickly sync and reload data on the dashboard.
- **Interactive UX:** Responsive loading indicators, graceful error handling, and helpful empty states enhance the overall feel of the application.

## Technology Stack

- **Framework:** React Native / Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **State Management:** React Context API & `useReducer`
- **Data Persistence:** `@react-native-async-storage/async-storage`
- **Icons & Graphics:** `@expo/vector-icons` & `react-native-svg`
- **Date Picking:** `@react-native-community/datetimepicker`

## Folder Structure Explanation

The codebase is organized in a highly modular and scalable pattern:

```text
src/
├── components/     # Reusable UI building blocks (TaskCard, SearchBar, FilterBar, StatCard, ErrorMessage)
├── context/        # Global state providers using Context API (AuthContext, TaskContext)
├── hooks/          # Custom React hooks containing abstracted logic (useTaskFilter)
├── navigation/     # Navigators defining the app's routing (AppNavigator, AuthNavigator, MainTabNavigator)
├── screens/        # Full-page screen components (DashboardScreen, StatisticsScreen, LoginScreen, TaskFormScreen)
├── services/       # External service and API integrations (TaskStorage for AsyncStorage)
├── types/          # TypeScript interfaces and type definitions ensuring type safety across the app
└── utils/          # Helper functions and utility scripts (validation routines)
```

## Installation Instructions

To get the project up and running locally, follow these steps:

1. **Clone the repository** (if applicable) and navigate to the project directory:
   ```bash
   cd task-manager
   ```

2. **Install dependencies:**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npx expo start
   ```

4. **Run on an emulator or physical device:**
   - Press `i` to open in the iOS Simulator.
   - Press `a` to open in the Android Emulator.
   - Or, scan the QR code using the Expo Go app on your physical device.

## Assumptions Made

- **Authentication is Simulated:** The application uses a mock authentication system for demonstration purposes. Any valid email and password format will grant access.
- **Local-Only Storage:** All tasks and user sessions are stored locally on the device using `AsyncStorage`. There is no remote backend database synchronization in the current version.
- **Single User Context:** The app operates under the assumption of a single active user profile on the device at a time.

## Potential Future Improvements

- **Backend Integration:** Connect the app to a remote database (e.g., Firebase, Supabase) to enable cross-device synchronization and real user authentication.
- **Push Notifications:** Implement local or remote push notifications to remind users of upcoming or overdue tasks.
- **Dark Mode Support:** Add a global theme toggle to switch between light and dark modes.
- **Enhanced Categorization:** Allow users to create custom categories, tags, or projects to organize tasks beyond just priorities.
- **Charting Libraries:** Integrate a library like `react-native-chart-kit` for more complex and interactive visual productivity statistics.
