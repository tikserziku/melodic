import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Routes будут добавлены позже
// import userRoutes from './routes/userRoutes';
// import trackRoutes from './routes/trackRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/tracks', trackRoutes);

app.get('/', (req, res) => {
  res.send('Melodic Linker API is running');
});

app.listen(PORT, () => {
  console.log(Server running on port );
});
