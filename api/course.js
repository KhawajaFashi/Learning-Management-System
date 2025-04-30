import { connectToDatabase } from '../lib/mongodb';
import Course from '../models/Course';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const { name, title, description, totalLesson, videoUrl, userName } = req.body;

        // Create new course
        const course = new Course({
            courseName: title,
            description,
            totalLesson,
            videoUrl,
            instructorName: name
        });

        await course.save();

        // Add course to user's enrolled courses
        const user = await User.findOneAndUpdate(
            { username: userName },
            {
                $push: {
                    enrolledCourses: {
                        _id: course._id,
                        lessonCompleted: 0
                    }
                },
                $inc: { activeCourses: 1 }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Course added successfully", data: course });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Server error' });
    }
} 