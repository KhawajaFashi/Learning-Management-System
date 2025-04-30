import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const { userName, feedback } = req.body;

        if (!userName || !feedback) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await User.findOneAndUpdate(
            { username: userName },
            {
                $push: {
                    feedback: {
                        comment: feedback.comment,
                        course: feedback.course,
                        createdAt: new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })
                    }
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Feedback added successfully",
            data: { feedback: user.feedback }
        });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 