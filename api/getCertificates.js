import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const { userName } = req.body;

        const user = await User.findOne({ username: userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const certificates = user.certificates || [];
        res.status(200).json({ message: "Certificates fetched successfully", data: { certificates } });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 