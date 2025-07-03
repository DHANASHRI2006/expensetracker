// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (only one connection)
mongoose.connect('mongodb://127.0.0.1:27017/spendsmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// -------------------- SCHEMAS AND MODELS -------------------------

// Login Schema
const loginSchema = new mongoose.Schema({
  email: String,
  userType: String,
  loginTime: String,
});

const Login = mongoose.model('Login', loginSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String,
  rating: Number,
  userId: String,
  date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// -------------------- ROUTES -------------------------

// LOGIN Routes

// Save Login
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

// Get all Logins
app.get('/api/logins', async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch (error) {
    console.error('Error fetching logins:', error);
    res.status(500).json({ message: 'Failed to fetch logins' });
  }
});

// FEEDBACK Routes

// Create Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All Feedbacks
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Feedback
app.put('/api/feedback/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    );
    res.json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- START SERVER -------------------------

const PORT = 5000; // Only one port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
