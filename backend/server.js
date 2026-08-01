const dotenv = require('dotenv');
dotenv.config();   // ✅ must run before anything that reads process.env at load time

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const session = require('express-session');
const passport = require('./config/passport');   // ✅ now env vars are already loaded

connectDB();

const app = express();
app.use(express.json());

// ✅ Allow all Vercel preview URLs + production URL
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'https://localhost:5173',
    ];
    if (!origin || origin.endsWith('.vercel.app') || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());

const taskRoutes = require("./routers/TaskRoutes.js");
const userRoutes = require("./routers/UserRoutes.js");
const projectRoutes = require('./routers/ProjectRoutes.js');
const adminRoutes = require('./routers/adminRoutes.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const aiRoutes = require('./routers/AiRoutes.js');
const googleAuthRoutes = require('./routers/googleAuthRoutes.js');

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users/auth', googleAuthRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});