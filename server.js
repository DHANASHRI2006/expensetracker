// server.js (or index.js)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/spendsmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define schema
const loginSchema = new mongoose.Schema({
  email: String,
  userType: String,
  loginTime: String,
});

// Create model
const Login = mongoose.model('Login', loginSchema);

// API endpoint to save login
app.post('/api/logins', async (req, res) => {
  const { email, userType, loginTime } = req.body;
  
  try {
    const newLogin = new Login({ email, userType, loginTime });
    await newLogin.save();
    res.status(201).json({ message: 'Login stored successfully' });
  } catch (error) {
    console.error('Error saving login:', error);
    res.status(500).json({ message: 'Failed to store login' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
