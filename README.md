# 🛒 E-commerce Backend API

This is a fully functional **e-commerce backend** built using **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs to manage users, products, orders, authentication, and other essential features for an online shopping platform.

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment config
- **Postman** or any HTTP client for testing

## 🔐 API Features

- 🔑 **User Authentication**
  - Register & login using JWT
  - Protected routes for logged-in users and admins
- 📦 **Product Management**
  - Create, update, delete, get all or single product
- 🛍️ **Order Management**
  - Create order, view orders by user or admin
- 👤 **User Management**
  - Admin can view all users and delete users
- 📊 **Admin Dashboard**
  - View total sales, orders, and users (optional if added)

## ⚙️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Start the server**

```bash
npm run dev
```

Server will run at `http://localhost:5000`.

---

## 🧪 API Testing

Use **Postman** or any REST client to test endpoints like:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/orders`

Authentication is required for protected routes.

---

## 📌 Future Improvements

- Add payment integration (e.g. Stripe, PayPal)
- Add image upload with Cloudinary or Multer
- Build frontend using React or another framework
- Add product reviews and ratings

---

## 👨‍💻 Developed by

**Eyob Mulugeta**  
[eyobbmulugeta@gmail.com](mailto:eyobbmulugeta@gmail.com)  
Telegram: [@Ecode_env](https://t.me/Ecode_env)
