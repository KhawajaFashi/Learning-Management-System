import { connectToDatabase } from '../lib/mongodb';
import Course from '../models/Course';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const courses = await Course.find();

        if (courses.length === 0) {
            return res.status(200).json({ message: "No Courses Available" });
        }

        res.status(200).json({ message: "Courses fetched successfully", data: courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 