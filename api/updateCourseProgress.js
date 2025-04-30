import { connectToDatabase } from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { _id, userName } = req.body;
    
    const user = await User.findOneAndUpdate(
      { username: userName },
      { $inc: { [`enrolledCourses.$[elem].lessonCompleted`]: 1 } },
      { 
        arrayFilters: [{ "elem._id": _id }],
        new: true 
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Course progress updated successfully", data: user });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 