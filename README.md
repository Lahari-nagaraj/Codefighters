# 🌾 Agrastra - Farmer Marketplace & Ecosystem MVP

A comprehensive full-stack platform connecting farmers with buyers, equipment sellers, and government services. Built for hackathons with real-world scalability in mind.

## 🚀 Features

### Multi-Role Dashboard System
- **👨‍🌾 Farmer Dashboard**: Crop management, auctions, equipment rental, government schemes
- **🏪 Buyer Dashboard**: Browse crops, participate in auctions, direct farmer connections
- **🏛️ Admin Dashboard**: Manage MSP, government schemes, platform oversight
- **🚜 Equipment Seller**: List and manage agricultural equipment rentals
- **👥 Consumer Dashboard**: Explore crops, farmer profiles, transparency features

### Core Functionality
- **📈 Real-time Pricing**: MSP comparison with dynamic market pricing
- **⚡ Live Auctions**: Real-time bidding system for premium crops
- **🔍 Smart Search**: Location-based equipment and crop discovery
- **💬 AI Chatbot**: Multilingual farming assistance (EN, HI, KN)
- **🎮 Gamification**: Credit system with rewards and redemption
- **🌤️ Weather Integration**: Crop advisories and weather alerts
- **📰 News & Schemes**: Government schemes and agricultural news

### Payment & Commerce
- **💳 Razorpay Integration**: Seamless payment processing
- **💰 Stripe Support**: International payment capabilities
- **📊 Fair Price Calculator**: MSP vs Market comparison
- **📈 Price Trend Charts**: Historical pricing analysis

### Technology Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + REST APIs
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google + Phone OTP)
- **File Storage**: Cloudinary integration
- **Payment**: Razorpay + Stripe
- **Deployment**: Production-ready configuration

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+
- Firebase Project
- Cloudinary Account
- Razorpay/Stripe Accounts

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd agrastra-mvp
npm install
```

2. **Environment Setup**
```bash
# Copy and configure environment variables
cp .env.example .env

# Update .env with your credentials:
# - Firebase configuration
# - Cloudinary keys
# - Payment gateway keys
# - External API keys
```

3. **Firebase Setup**
- Create a new Firebase project
- Enable Firestore and Authentication
- Add Google Sign-in provider
- Update Firebase config in `.env`

4. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run client  # Frontend on :5173
npm run server  # Backend on :5000
```

## 📁 Project Structure

```
agrastra-mvp/
├── server/                 # Backend API
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & validation
│   └── index.js          # Server entry point
├── src/                   # Frontend React app
│   ├── components/        # UI components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── config/           # Firebase config
├── public/               # Static assets
└── package.json         # Dependencies
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile/:uid` - Get user profile
- `PUT /api/auth/profile/:uid` - Update profile

### Crops
- `GET /api/crops` - List crops with filters
- `POST /api/crops` - Add new crop
- `PUT /api/crops/:id` - Update crop
- `GET /api/crops/farmer/:id` - Farmer's crops

### Auctions
- `GET /api/auctions` - List auctions
- `POST /api/auctions` - Create auction
- `POST /api/auctions/:id/bid` - Place bid

### Equipment
- `GET /api/equipment` - List equipment
- `POST /api/equipment` - Add equipment
- `POST /api/equipment/:id/rent` - Rent equipment

### Pricing & Data
- `GET /api/pricing/msp` - MSP rates
- `GET /api/pricing/trends/:crop` - Price trends
- `GET /api/pricing/weather` - Weather data

### Payments
- `POST /api/payments/razorpay/create-order` - Create Razorpay order
- `POST /api/payments/stripe/create-payment-intent` - Stripe payment

## 🎨 UI Components

### Dashboards
- Role-based routing and navigation
- Real-time data visualization
- Responsive design for all devices

### Key Features
- **Crop Listings**: Image upload, pricing, quality indicators
- **Auction System**: Live bidding with real-time updates
- **Equipment Rental**: GPS-based discovery and booking
- **Chat System**: AI-powered multilingual support
- **Payment Flow**: Integrated checkout experience

## 🔐 Security & Best Practices

- Firebase Authentication for secure access
- Role-based authorization
- API rate limiting and validation
- Secure file uploads to Cloudinary
- Payment data encryption
- CORS and security headers

## 🌐 Deployment

### Environment Variables Required
```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Payment Gateways
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=

# File Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy frontend to your preferred platform
# Deploy backend to Heroku, Railway, or similar
```

## 🎯 Hackathon Ready Features

- ✅ Multi-role authentication system
- ✅ Real-time crop marketplace
- ✅ Live auction system
- ✅ Equipment rental platform
- ✅ Payment gateway integration
- ✅ AI chatbot with multilingual support
- ✅ Government schemes integration
- ✅ Weather and MSP data
- ✅ Gamification and rewards
- ✅ Responsive design
- ✅ Production-ready architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for hackathons and learning!

---

**Built for farmers 👨‍🌾 • Powered by technology 💻 • Driven by impact 🌱**

For support or questions, reach out to the development team!