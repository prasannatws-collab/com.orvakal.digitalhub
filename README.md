# Orvakal Digital Hub Mobile App (Android & iOS)

A premium, ultra-stylish, and user-friendly mobile application built using **React Native with Expo & TypeScript**, based on the Orvakal Village web portal. 

Developed with a clean layered architecture, the app prioritizes accessibility (rural audio assistance) and localized proximity-based utility sorting.

---

## 🚀 Key Features

* **Interactive Glassmorphic Dashboard**: Real-time clock, greeting selector, and responsive weather widget using Open-Meteo services.
* **Proximity-Based Sorting (GPS)**: Utilizes native location interfaces (`expo-location`) to calculate distances dynamically and sort banks, ATMs, post offices, schools, and local services from nearest to farthest.
* **Text-To-Speech Audio Reader**: Integrated native audio reader using `expo-speech` to synthesize crop advisories, government schemes, and notifications in English, Telugu, and Hindi.
* **Emergency SOS Center**: Rapid access to local ambulance, police station, and road emergency lines.
* **Farming Hub**: Electricity feeder timetables, real-time mandi prices, minimum support prices (MSP), and tractor sharing listings.
* **Services & Job Directories**: Catalog of local shops, daily-wage labour registries, and mega industrial plants linked to the Orvakal Node.
* **Multi-Lingual support**: Fully localized inside React context in English, Telugu (తెలుగు), and Hindi (हिंदी).

---

## 🏛️ Clean Architecture & SOLID Adherence

The project is structured into strict boundaries to isolate responsibilities:

1. **Presentation Layer (`src/features/` & `src/core/components/`)**: React Native UI views, stylesheets, and custom controller hooks (`useWeatherClock`).
2. **Domain Layer (`src/domain/`)**: Declares pure TypeScript contracts, entities, and service interfaces (`ILocationService`, `ISpeechService`, `IWeatherService`).
3. **Data Layer (`src/data/`)**: Adapts native plugins to core contracts (`ExpoLocationService`, `ExpoSpeechService`), hosts static mock records, and integrates remote APIs (`OpenMeteoWeatherService`).
4. **Core Infrastructure (`src/core/di/` & `src/core/state/`)**: Dependency injection registry (`di.ts`) and global react providers (Language, Theme, DomainData).

---

## 🛠️ Get Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

3. Run on virtual simulators or test via **Expo Go** on your device:
   ```bash
   # Android
   npm run android

   # iOS (Requires macOS)
   npm run ios
   ```

### Running Tests
Execute the Jest regression test suite:
```bash
npm run test
```
