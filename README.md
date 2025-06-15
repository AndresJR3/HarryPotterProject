# 🧙‍♂️ Wizarding Realm

React Native **mobile app** that lets you **sign in with Firebase Authentication** and explore the **Harry Potter universe** via the open REST endpoint [https://potterapi-fedeperin.vercel.app/es/characters](https://potterapi-fedeperin.vercel.app/es/characters).

---

## ✨ Features

| Area        | What you get                                                      |
| ----------- | ----------------------------------------------------------------- |
| **Auth**    | Email/Password & Google Sign‑In powered by Firebase Auth          |
| **Data**    | Live list of characters from the Potter API, search & detail view |
| **UX**      | React Navigation (stack + tab), dark‑mode ready, pull‑to‑refresh  |
| **State**   | Context API + hooks — no extra state library needed               |
| **Tooling** | ESLint + Prettier + TypeScript configured out of the box          |

---

## 🚀 Quick Start

### 1 · Prerequisites

```bash
# Node & package manager
node --version   # ≥ 18.x
npm  --version   # v10 or yarn v1 classic

# Expo (recommended) ‑ or install full React Native CLI
npm install -g expo-cli
```

> **Android Studio** (AVD) or **Xcode** (simulator) required for running on emulators if you are not using Expo Go.

### 2 · Clone & Install

```bash
git clone https://github.com/YOUR_USER/wizarding-realm.git
cd wizarding-realm
npm install        # or yarn
```

### 3 · Install Required Dependencies

```bash
npm install firebase@11.9.1 --save
npm install react-native-uuid
npm install prop-types
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-get-random-values
npm install @react-native-async-storage/async-storage
npm install expo-linear-gradient
```

---

### 📁 Project Folder Structure

```bash
HARRYPOTTERPROJECT/
├── .expo/
├── assets/
├── node_modules/
├── src/
│   ├── components/
│   ├── navigation/
│   │   └── NavigationLogin.js
│   └── screens/
│       ├── CharacterListingScreen.js
│       ├── CreateCharacterScreen.js
│       ├── CreateSpellScreen.js
│       ├── DetailsNewCharacterScreen.js
│       ├── DetailsScreenCharacter.js
│       ├── HomeScreen.js
│       ├── LoginScreen.js
│       ├── SpellDetailScreen.js
│       ├── SpellsScreen.js
│       ├── UpdateCharacterScreen.js
│       └── UpdateSpellScreen.js
├── .gitignore
├── App.js
├── app.json
├── firebase.js
├── index.js
├── installs.txt
├── metro.config.js
├── package.json
└── README.md
```

---

### 4 · Configure Firebase

1. Create a new project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. **Enable Authentication ▶ Sign‑in Method** → Email/Password + Google.
3. Register iOS & Android apps and download:

   * `google-services.json` (Android)
   * `GoogleService-Info.plist` (iOS)
4. Place the files:

   * `android/app/google-services.json`
   * `ios/GoogleService-Info.plist`
5. Copy your web config into **`src/config/firebase.ts`**:

   ```ts
   import { initializeApp } from 'firebase/app';

   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_PROJECT.firebaseapp.com',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_PROJECT.appspot.com',
     messagingSenderId: 'SENDER_ID',
     appId: 'APP_ID',
   };

   export const app = initializeApp(firebaseConfig);
   ```

### 5 · Environment Variables

Create a `.env` at project root:

```
API_BASE=https://potterapi-fedeperin.vercel.app/es
```

### 6 · Run the app

```bash
# Expo (cross‑platform, easiest)
npx expo start

# React Native CLI (if you prefer fully native):
# Android
npx react-native run-android
# iOS (macOS only)
npx react-native run-ios
```

---

## 🗂️ Project Structure

```
wizarding-realm/
├── App.tsx               # Entry — registers Navigation & providers
├── .env
└── src/
    ├── components/       # Reusable UI widgets (Button, Card, etc.)
    ├── screens/          # AuthScreen, CharactersScreen, DetailScreen
    ├── navigation/       # Stack & Tab navigators
    ├── hooks/            # useAuth, useCharacters
    ├── config/
    │   └── firebase.ts   # 🔑 Firebase initialization
    ├── services/
    │   └── api.ts        # Axios instance (reads API_BASE)
    └── types/            # TypeScript types & interfaces
```

---

## 🧙 API Cheat‑Sheet (Potter API)

* **Base URL:** `${API_BASE}` (`https://potterapi-fedeperin.vercel.app/es`)
* **Characters Endpoint:** `/characters`
* **Example call:**

  ```ts
  import api from '../services/api';

  const { data: characters } = await api.get('/characters');
  ```
* **Sample response:**

  ```json
  [
    {
      "id": "5f26084764237b0022dd3535",
      "name": "Harry Potter",
      "house": "Gryffindor",
      "species": "humano",
      "patronus": "Ciervo",
      ...
    }
  ]
  ```

---

## 🔐 Firebase Auth Flow

1. User taps **Sign Up** → `createUserWithEmailAndPassword`.
2. Session stored by Firebase; listener in `useAuth` hook hydrates context.
3. Protected screens are wrapped in an **AuthStack** guard.

> For Google Sign‑In, this boilerplate uses **`expo-auth-session`** (if Expo) or `@react-native-google-signin/google-signin` (RN CLI).

---

## 🧰 Useful Scripts

| Command                   | Purpose                           |
| ------------------------- | --------------------------------- |
| `npm run start`           | Expo dev server                   |
| `npm run android` / `ios` | Run on specific platform (RN CLI) |
| `npm run lint`            | ESLint + Prettier check           |
| `npm run test`            | Jest unit tests                   |

---

## 🩹 Troubleshooting

* **`Firebase: Analytics is not supported`** → Ignore or wrap analytics init with `isSupported()`.
* **Android build fails due to Play Services** → Ensure `google-services.json` in correct path & Gradle plugin v4+.
* **Network request failed on physical device** → Check that device and dev PC are on same network; use HTTPS API URL.

---

## 🤝 Contributing

1. Fork & create a branch: `git checkout -b feature/your-feature`
2. Commit & push: `git push origin feature/your-feature`
3. Open a Pull Request 🎉

---

## © License

MIT — free to use, modify & redistribute.

---

### 📚 Resources

* React Native Docs [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
* Expo Docs [https://docs.expo.dev/](https://docs.expo.dev/)
* Firebase Web SDK [https://firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup)
* Potter API Reference [https://potterapi-fedeperin.vercel.app](https://potterapi-fedeperin.vercel.app)
