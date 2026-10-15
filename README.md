# HPU Dashcam & Telemetry Monitoring System

A comprehensive vehicle monitoring dashboard built with Laravel, React (Inertia.js), and Tailwind CSS. This system integrates seamlessly with the **CMSV6 platform** for real-time dashcam streaming, GPS tracking, and telemetry data processing.

## 🚀 Key Features

- **Live Video Streaming:** Dual-channel camera support (CAM 1 - Front, CAM 2 - Cabin) directly streamed via CMSV6 media server with low-latency optimizations.
- **Real-time GPS & Telemetry:** Live tracking of vehicle coordinates on interactive maps (Pigeon Maps / Leaflet). Monitors live metrics including speed, fuel level, and satellite locks.
- **Alarm & Event Center:** Synchronization with CMSV6 Alarm Center to track critical ADAS and DMS events such as:
  - Fierce Driving (Harsh Acceleration, Harsh Braking, Sharp Turn)
  - G-Sensor & Crash Alarms
  - Fatigue Driving & Driver Distraction
  - Overspeed warnings
- **Driver Management:** Interface for driver check-in, real-time facial/passenger detection state management, and target driver tracking.
- **Background Telemetry Worker:** Custom artisan command (`dashcam:monitor-telemetry`) to continuously poll and process real-time status and active alarms.

## 🛠️ Tech Stack

**Backend:**
- Laravel 13 (PHP 8.3)
- Laravel Sanctum & Fortify
- PestPHP for testing

**Frontend:**
- React 19
- Inertia.js
- Tailwind CSS v4 & Radix UI Primitives
- Vite & TypeScript
- Zustand for state management

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CahyaDwiSaputra/Magang-HPU.git
   cd Magang-HPU
   ```

2. **Install Dependencies:**
   Install both PHP and Node.js dependencies using the pre-configured setup script:
   ```bash
   composer setup
   ```
   *(This will run `composer install`, copy `.env`, generate app key, migrate database, `npm install`, and `npm run build`)*

3. **Configure Environment Variables:**
   Update your `.env` file with your specific CMSV6 credentials:
   ```env
   CMSV6_BASE_URL="http://your-cmsv6-server:8080"
   CMSV6_ACCOUNT="your-account"
   CMSV6_PASSWORD="your-password"
   CMSV6_DEVICE_ID="your-device-id"
   ```

4. **Run the Development Server:**
   The `dev` script uses concurrently to run the Laravel server, Vite dev server, Queue worker, and the Telemetry Monitor simultaneously:
   ```bash
   npm run dev
   ```

## 👨‍💻 Developer

Developed by **[CahyaDwiSaputra](https://github.com/CahyaDwiSaputra)**.
