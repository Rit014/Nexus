const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // allow server to accept the json data in the body
const taskRoutes = require("./routers/TaskRoutes.js");
const userRoutes = require("./routers/UserRoutes.js");
const { errorHandler } = require('./middleware/errorMiddleware.js');
const projectRoutes = require('./routers/ProjectRoutes.js');
const adminRoutes = require('./routers/adminRoutes.js')



app.use(cors()); // allow our react app to make requests

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);


app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})