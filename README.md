# Framez

A modern social media mobile application built with React Native and Expo, featuring real-time post sharing, image uploads, and user authentication.

## Features

- 🔐 **User Authentication** - Firebase Authentication with email/password
- 📱 **Post Creation** - Share text and images with your network
- 🖼️ **Image Upload** - Upload and share photos from your device
- ❤️ **Like System** - Like posts with real-time updates
- 👤 **User Profiles** - View and edit your profile
- 🔄 **Real-time Feed** - Live updates of posts using Firestore listeners
- 🗑️ **Post Management** - Delete your own posts
- 🎨 **Dark Theme** - Sleek black and gold UI design

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **Backend:** Firebase
  - Authentication
  - Firestore Database
  - Storage (for images)
- **State Management:** React Context API
- **UI Components:** Custom components with consistent theming
- **Date Handling:** Day.js with relative time
- **Image Handling:** Expo Image Picker
- **Storage:** AsyncStorage for auth persistence

## Project Structure

```
framez/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input)
│   │   ├── Header.tsx
│   │   ├── Logo.tsx
│   │   ├── PostCard.tsx
│   │   └── ScreenHeader.tsx
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx # Authentication state management
│   ├── lib/                # Third-party integrations
│   │   └── firebase.ts     # Firebase configuration
│   ├── navigation/         # App navigation
│   │   ├── RootNavigator.tsx
│   │   ├── stacks/         # Stack navigators
│   │   └── tabs/           # Tab navigators
│   ├── screens/            # App screens
│   │   ├── auth/           # Authentication screens
│   │   ├── CreatePostScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── theme/              # Styling and theming
│   │   ├── colors.ts       # Color palette
│   │   └── index.ts
│   └── types/              # TypeScript type definitions
├── assets/                 # Static assets (images, icons)
├── App.tsx                 # App entry point
├── app.json                # Expo configuration
├── package.json
└── tsconfig.json
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **pnpm**
- **Expo CLI**
- **Firebase Account** with a project set up

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd framez
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Set up Firebase Storage
   - Copy your Firebase config credentials

4. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your Firebase credentials:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your Firebase configuration:

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
   ```

## Running the App

### Development Mode

```bash
# Start the Expo development server
pnpm start

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on Web
pnpm web
```

### Using Expo Go

1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

## Firebase Setup

### Firestore Collections

The app uses the following Firestore structure:

#### `posts` collection
```javascript
{
  authorId: string,          // User UID
  authorName: string,        // Display name
  authorAvatar: string,      // Profile photo URL
  text: string,              // Post content
  imageUrl: string | null,   // Uploaded image URL
  likes: string[],           // Array of user UIDs who liked
  createdAt: Timestamp       // Server timestamp
}
```

### Storage Structure

Images are stored in Firebase Storage at:
```
posts/{userId}/{timestamp}
```

### Security Rules

Make sure to configure appropriate Firestore and Storage security rules for production use.

## Key Features Explained

### Authentication Flow
- Unauthenticated users see Sign In/Sign Up screens
- Authentication state persists using AsyncStorage
- Authenticated users access the main app (Feed, Create, Profile)

### Real-time Updates
- Posts feed updates in real-time using Firestore listeners
- Like counts update instantly across all users
- Profile posts sync automatically

### Image Upload
- Users can pick images from their device library
- Images are compressed (70% quality) before upload
- Images are stored in Firebase Storage with unique timestamps

### Theme System
- Consistent dark theme with gold accents
- Centralized color palette in `src/theme/colors.ts`
- Reusable UI components for buttons and inputs

## Color Palette

The app uses a sophisticated dark theme with gold accents:

- **Background:** Black (#000000) with subtle grays
- **Text:** Ivory (#FFFFF0) for primary text
- **Accent:** Gold (#FFD700) for highlights and CTAs
- **Borders:** Dark gray (#333333)

## Scripts

- `pnpm start` - Start Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS device/simulator
- `pnpm web` - Run on web browser

## Building for Production

This project uses EAS (Expo Application Services) for building and deployment.

### Build Configuration

The project is configured with:
- Android package: `com.leonesii.framez`
- EAS Project ID: `5c22002a-2d0b-47cd-b8eb-e1294365ef2b`

### Create Production Builds

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Firebase Connection Issues
- Verify all Firebase credentials in `.env`
- Ensure Firebase services (Auth, Firestore, Storage) are enabled
- Check Firebase Console for error logs

### Build Errors
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility

### Image Upload Failures
- Verify Firebase Storage rules
- Check network connectivity
- Ensure storage bucket is properly configured

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend powered by [Firebase](https://firebase.google.com/)
- Icons by [@expo/vector-icons](https://icons.expo.fyi/)

---

**Note:** This is a development project. Ensure proper security measures, error handling, and testing before deploying to production.
