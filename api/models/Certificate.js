import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({});
certificateSchema.add({
    id: {
        type: Number,
    },
    issuedTo: {    
        type: String,
        default: ''
    },
    courseName: {
        type: String,
        default: ''
    },
    instructorName: {
        type: String,
        default: ''
    },
    completionDate: {
        type: String,
        default: ''
    },
});

export default certificateSchema;