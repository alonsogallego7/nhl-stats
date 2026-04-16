# NHL Stats Application

## Overview
A full-stack web application built for aggregating, displaying, and filtering official National Hockey League (NHL) data in real-time. This project features a modern, responsive interface utilizing complex bento-grid layouts and a robust, scalable architecture engineered to handle intensive data loads efficiently.

## Technical Stack
- **Frontend Framework:** Angular 19+ (Standalone Components, Signals, modern 'inject()' Dependency Injection)
- **Backend / API Gateway:** Node.js with Express
- **Styling:** Custom Vanilla CSS featuring a global design system, dark/light mode support, and comprehensive 'Inter' typography

## Key Features
- **Comprehensive Dashboards:** Specialized bento-grid interfaces for Live Games, NHL Standings, Team Directories, and deep-dive Player detail pages.
- **Real-Time Data Processing:** Live tracking of game scores, active periods, and shots on goal.
- **Advanced Filtering:** A live text-filtering engine capable of searching through the entire active NHL roster (~800 players) in real-time by name or team metadata without performance degradation.
- **Architectural Scalability:** Centralized CSS utilities to enforce a unified aesthetic and significantly reduce component bundle sizes.

## Technical Highlight: Double-Tier Caching System
A core technical achievement in this application is the implementation of a double-tier caching strategy designed to provide zero-latency user experiences while completely protecting against third-party API rate limiting (HTTP 429 errors).

1. **Frontend Observable Caching (Memory):**
   Angular services utilize RxJS `shareReplay(1)` to cache the initial outbound API responses. This strategy eliminates micro-downloads and redundant HTTP calls upon component tab-switching or routing, ensuring immediate data rendering.

2. **Backend Gateway Cache (Node.js Map):**
   The Express server acts as a proxy to the official NHL API. It intercepts all edge requests and serves them from an internal Map cache with route-specific Time-To-Live (TTL) values:
   - **30 Seconds TTL:** For volatile, live-action endpoints (e.g., live game scores).
   - **1 Hour TTL:** For static foundational data (e.g., team directories, active NHL standings).

## Project Structure
The repository is structured as a standard monorepo dividing the client application and the API gateway.

- `/client`: Angular 19 frontend workspace.
- `/client/src/app/components`: Feature-based routing (Games, Teams, Players, Standings, Statistics).
- `/client/src/app/services`: State and API data hydration.
- `/client/src/styles.css`: Global design system and layout utility classes.
- `/server`: Node/Express proxy backend.
- `/server/routes`: Data transformation endpoints merging assets onto the NHL API responses.
- `/server/utils`: Core API interceptor and caching engine.

## Local Installation and Execution

### Prerequisites
- Node.js (version 18+ recommended)
- Angular CLI (`npm i -g @angular/cli`)

### Backend Setup
1. Navigate to the server directory:
   `cd server`
2. Install dependencies:
   `npm install`
3. Start the Express server:
   `npm start`
   The backend will bootstrap on `http://localhost:3000` (or the configured environment port).

### Frontend Setup
1. Open a new terminal instance and navigate to the client directory:
   `cd client`
2. Install dependencies:
   `npm install`
3. Launch the development server:
   `npm start`
   The Angular application will serve on `http://localhost:4200`.
