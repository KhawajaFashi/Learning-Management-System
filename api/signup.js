import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const user = new User({
            name: req.body.name,
            username: req.body.email,
            password: req.body.password,
        });

        await user.save();
        res.status(200).json({ message: 'Signup successful', data: req.body });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 