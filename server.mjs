// server.mjs
import dotenv from 'dotenv';
dotenv.config();const apiKey = process.env.API_KEY;
console.log("API Key:", apiKey);  

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import cors from 'cors';
import User from './User.mjs';


const app = express();
app.use(cors());
app.use(bodyParser.json());

// ----------------------
// MongoDB connection
// ----------------------
const mongoURI = "mongodb://127.0.0.1:27017/itr_portal"; // Change if needed
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// ----------------------
// Register API
// ----------------------
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ----------------------
// Login API
// ----------------------
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ----------------------
// Chatbot API placeholder
// ----------------------
app.post('/chatbot', async (req, res) => {
    const { message } = req.body;

    // Simple echo chatbot (replace with OpenAI integration if needed)
    const reply = `You said: ${message}`;

    res.status(200).json({ reply });
});

// ----------------------
// Start server
// ----------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
