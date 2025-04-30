import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    instructorName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    totalLesson: {
        type: Number,
        required: true
    }
});

const Course = mongoose.model("Course", courseSchema);
export default Course;