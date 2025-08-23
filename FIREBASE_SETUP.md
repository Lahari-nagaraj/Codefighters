# Firebase Authentication Setup Guide

## 🔐 Enable Email/Password Authentication

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Check "Email link (passwordless sign-in)" if you want passwordless auth
   - Click "Save"

### 2. Enable Google OAuth (if not already enabled)
1. In the same **Sign-in method** section
2. Click on **Google**
3. Toggle "Enable" to ON
4. Add your **Project support email**
5. Click "Save"

### 3. Authorized Domains
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - For development: `localhost`, `127.0.0.1`
   - For production: your actual domain

## 🌐 Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Testing Authentication

### Test Email/Password Sign Up:
1. Go to `/auth` page
2. Select a role (farmer, buyer, etc.)
3. Click "Sign Up" tab
4. Fill in the form with valid email/password
5. Submit and check Firebase Console → Authentication → Users

### Test Email/Password Sign In:
1. Use the same credentials from sign up
2. Click "Sign In" tab
3. Enter email/password
4. Should redirect to dashboard

### Test Google OAuth:
1. Click "Continue with Google" button
2. Complete Google sign-in flow
3. Should redirect to dashboard

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Email already in use"
- User already exists with that email
- Use "Sign In" instead of "Sign Up"

#### 2. "Weak password"
- Password must be at least 6 characters
- Add numbers/special characters for strength

#### 3. "Invalid email"
- Check email format (must include @ and domain)
- Ensure no extra spaces

#### 4. "User not found"
- Email doesn't exist in Firebase
- Use "Sign Up" to create account

#### 5. "Wrong password"
- Double-check password spelling
- Check caps lock

## 📱 Features

### ✅ What's Working:
- Email/password sign up with validation
- Email/password sign in
- Google OAuth authentication
- Role-based routing
- Form validation with error messages
- Password visibility toggle
- Responsive design
- Multi-language support

### 🔒 Security Features:
- Password strength validation
- Email format validation
- Firebase security rules
- Protected routes
- Role-based access control

## 🎯 Next Steps

1. **Customize Validation Rules**: Modify validation in `AuthPage.jsx`
2. **Add Password Reset**: Implement "Forgot Password" functionality
3. **Email Verification**: Enable email verification in Firebase
4. **Social Logins**: Add Facebook, Twitter, etc.
5. **Two-Factor Auth**: Implement 2FA for enhanced security

## 📚 Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
