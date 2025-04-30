import mongoose from "mongoose";
import userCourseSchema from './UserCourseSchema.js'
import certificateSchema from './Certificate.js'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    activeCourses: {
        type: Number,
        default: 0,
    },
    courseCompleted: {
        type: Number,
        default: 0,
    },
    enrolledCourses: {
        type: [userCourseSchema],
        default: []
    },
    uploadedCourses: {
        type: [userCourseSchema],
        default: []
    },
    certificates: {
        type: [certificateSchema],
        default: []
    },
    feedback: {
        type: [{
            comment: String,
            course: userCourseSchema,
            createdAt: String
        }],
        default: []
    }
});

const User = mongoose.model('User', userSchema);
export default User;