import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const { name, title, userName, instructorName } = req.body;

        const newCertificate = {
            issuedTo: name,
            courseName: title,
            completionDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            instructorName: instructorName
        };

        const user = await User.findOneAndUpdate(
            { username: userName },
            {
                $inc: { courseCompleted: 1 },
                $push: { certificates: newCertificate }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Course completion updated successfully", data: user });
    } catch (error) {
        console.error('Error updating course completion:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 