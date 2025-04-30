import mongoose from "mongoose";


const userCourseSchema = new mongoose.Schema({});
userCourseSchema.add({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    lessonCompleted: {
        type: Number,
        default: 0
    }
});


export default userCourseSchema;
