# Ration Shop Mobile App

A comprehensive mobile application for a ration shop built with React Native (frontend) and Node.js + Express (backend) with MongoDB database. The app supports both Android and iOS platforms and includes features for customers and admin users.

## 🚀 Features

### Customer Features
- **User Authentication**: Sign up, login, and profile management with JWT authentication
- **Product Browsing**: Browse ration categories (grains, pulses, flour, oils, spices, etc.)
- **Search & Filters**: Search products and filter by category, price range
- **Shopping Cart**: Add items, update quantities, remove items
- **Order Management**: Place orders, view order history, track order status
- **User Profile**: Manage personal information and address

### Admin Features
- **Admin Dashboard**: Overview of orders, products, and users
- **Product Management**: Add, update, delete ration items with stock management
- **Order Management**: View all orders, update order status (Pending, Packed, Delivered)
- **User Management**: View and manage customer accounts

### Technical Features
- **Cross-Platform**: React Native app for Android and iOS
- **REST API**: Express.js backend with comprehensive API endpoints
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **State Management**: Context API for state management
- **UI Components**: React Native Paper for beautiful, consistent UI
- **Navigation**: React Navigation for seamless navigation

## 📁 Project Structure

```
ration_shop/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── package.json
│   ├── server.js
│   └── env.example
├── frontend/               # React Native app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   │   ├── auth/       # Authentication screens
│   │   │   ├── customer/   # Customer screens
│   │   │   └── admin/      # Admin screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── context/        # Context providers
│   │   ├── services/       # API services
│   │   ├── components/     # Reusable components
│   │   └── utils/          # Utility functions
│   ├── App.js
│   ├── package.json
│   └── app.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ration_shop
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   - Local: Make sure MongoDB is running on your system
   - Atlas: Use your MongoDB Atlas connection string

5. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL:**
   Edit `src/services/api.js` and update the `BASE_URL`:
   ```javascript
   const BASE_URL = 'http://your-backend-url:5000/api';
   ```

4. **Start the development server:**
   ```bash
   # Start Expo development server
   npm start
   
   # Run on Android
   npm run android
   
   # Run on iOS
   npm run ios
   ```

## 📱 Running the App

### Android
1. Start the backend server
2. Start the React Native app: `npm run android`
3. The app will open in Android emulator or connected device

### iOS
1. Start the backend server
2. Start the React Native app: `npm run ios`
3. The app will open in iOS simulator or connected device

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  role: String (customer/admin),
  isActive: Boolean
}
```

### Product Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String,
  unit: String,
  isAvailable: Boolean,
  discount: Number,
  tags: [String]
}
```

### Order Collection
```javascript
{
  user: ObjectId (ref: User),
  orderNumber: String (unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  totalAmount: Number,
  status: String,
  paymentStatus: String,
  deliveryAddress: Object,
  notes: String
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id/status` - Update user status (Admin)

## 🚀 Building for Production

### Android APK
```bash
cd frontend
npm run build:android
```

### iOS IPA
```bash
cd frontend
npm run build:ios
```

## 📦 Deployment

### Backend Deployment
1. Deploy to platforms like Heroku, AWS, DigitalOcean
2. Update MongoDB connection string
3. Set environment variables
4. Configure CORS for your frontend domain

### Frontend Deployment
1. Build APK/IPA files
2. Upload to Google Play Store (Android)
3. Upload to Apple App Store (iOS)

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js for security headers

## 🎨 UI/UX Features

- Material Design with React Native Paper
- Responsive design for different screen sizes
- Dark/Light theme support
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Future Enhancements

- **Payment Integration**: Stripe, Razorpay, PayPal
- **Push Notifications**: Order updates, promotions
- **Delivery Tracking**: Real-time order tracking
- **Offline Support**: Cache data for offline browsing
- **Social Login**: Google, Facebook authentication
- **Reviews & Ratings**: Product reviews system
- **Wishlist**: Save favorite products
- **Coupons & Discounts**: Promotional codes
- **Multi-language Support**: Localization
- **Analytics**: User behavior tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Coding! 🎉**



