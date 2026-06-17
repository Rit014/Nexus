const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Allow all Vercel preview URLs + production URL
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
    ];
    // Allow all *.vercel.app URLs (preview deployments)
    if (!origin || origin.endsWith('.vercel.app') || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

const taskRoutes = require("./routers/TaskRoutes.js");
const userRoutes = require("./routers/UserRoutes.js");
const projectRoutes = require('./routers/ProjectRoutes.js');
const adminRoutes = require('./routers/adminRoutes.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});