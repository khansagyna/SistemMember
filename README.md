# Sistem Member

A robust member management mobile application built with React Native and Expo. 

## 🚀 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Database/Backend**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) & [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- **UI Components**: `@gorhom/bottom-sheet`, `react-native-chart-kit`
- **Language**: TypeScript

## 📦 Features

Based on the project structure, this system handles:
- **Member Management**: Add, view, edit, and manage members.
- **Transactions**: Track and manage member transactions.
- **Dashboard**: Analytics and insights utilizing `react-native-chart-kit`.
- **Promos**: Promotional management system.

## 🛠 Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## 🏃‍♂️ Getting Started

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd SistemMember
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` or `.env` file in the root directory and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Run on a device/emulator**:
   - Press `a` to run on Android.
   - Press `i` to run on iOS (requires macOS).
   - Press `w` to run on web.

## 📁 Project Structure

- `/app`: Expo Router file-based navigation
- `/src/components`: Reusable UI components
- `/src/features`: Feature-based modules (members, transactions, dashboard, etc.)
- `/src/context`: React Context for state management (e.g., Auth, Theme)
- `/assets`: Images, fonts, and other static files

## 📝 Scripts

- `npm run start` - Starts the Expo development server.
- `npm run android` - Starts the app on an Android emulator/device.
- `npm run ios` - Starts the app on an iOS simulator/device.
- `npm run web` - Starts the app on the web.
- `npm run lint` - Runs ESLint and Prettier to check for code issues.
- `npm run format` - Automatically formats the codebase using Prettier and ESLint.

## 📄 License

This project is proprietary and confidential.
