import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './models/User.js';
import Course from './models/Course.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// ✅ Fix: Call cors()
app.use(cors());
app.use(cors({ origin: "https://yourfrontend.netlify.app" }));
app.use(express.json()); // Allows handling JSON requests

// ✅ Fix: Use an async function for MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
connectDB();


// ✅ Basic API Route
app.get("/", (req, res) => {
    res.send("This is the Home page\n");
});
app.post("/signup", (req, res) => {
    const user = new User({
        name: req.body.name,
        username: req.body.email,
        password: req.body.password,
    });

    user.save();
    res.json({ message: 'Login data received', data: req.body });
});
app.post("/signin", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ username: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("Name: ", name, "User.name: ", user.name);
        res.status(200).json({ message: "Login successful!", data: user });
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/course", async (req, res) => {
    try {
        const { name, title, description, totalLesson, videoUrl } = req.body;
        const loginMail = req.body.userName;
        if (!loginMail) {
            console.log("Unauthorized. Please sign in first.");
            return res.status(401).json({ message: "Unauthorized. Please sign in first." });
        }
        console.log("Name: ", name);
        const addCourse = new Course({
            instructorName: name,
            courseName: title,
            description,
            totalLesson,
            videoUrl,
        });
        await addCourse.save();

        // ✅ Update user document with the new course
        const user = await User.updateOne(
            { username: loginMail },
            { $addToSet: { uploadedCourses: addCourse._id } }
        );


        res.json({ message: "Course added successfully!", data: user });
    } catch (err) {
        console.log("Error during course addition:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/getCourses", async (req, res) => {
    try {
        let courses = [];
        courses = await Course.find();
        if (courses.length === 0)
            res.json({ message: "No Courses Available" });
        else
            res.status(200).json({ message: "Courses fetched successfully", data: courses });
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/getCourseById", async (req, res) => {
    try {
        let course = await Course.findById(req.body._id);
        res.status(200).json({ message: "Enrolled Courses fetched successfully", data: course });
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/updateCourseProgress", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.userName, "enrolledCourses._id": req.body._id }, {
            $inc: { "enrolledCourses.$.lessonCompleted": 1 }
        });
        if (!user) {
            console.log("User not found.");
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Progress updated successfully", data: user });
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/updateCourseCompletion", async (req, res) => {
    try {
        console.log("Req.body: ", req.body);
        const newCertificate = {
            issuedTo: req.body.name,
            courseName: req.body.title,
            completionDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            instructorName: req.body.instructorName
        };
        const user = await User.findOneAndUpdate({ username: req.body.userName }, {
            $inc: { courseCompleted: 1 },
            $push: { certificates: newCertificate }
        },

        );

        if (!user) {
            console.log("User not found.");
            res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Course completion updated successfully", data: user });
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/getEnrolledCourses", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.userName });
        if (!user) {
            console.log("User not found.");
            res.status(404).json({ message: "User not found" });
        }

        else {
            const enrolledCourses = user.enrolledCourses;
            const activeCourses = user.activeCourses;
            const courseCompleted = user.courseCompleted;
            res.status(200).json({ message: "Enrolled Courses fetched successfully", data: { enrolledCourses, activeCourses, courseCompleted } });
        }
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});
app.post("/enrollCourse", async (req, res) => {
    try {
        const course = await Course.findById(req.body._id);
        if (!course) {
            return res.status(404).json({ message: "No Course Available" });
        }

        const user = await User.findOne({ username: req.body.userName });

        if (user) {
            // Step 1: Store the initial length of enrolledCourses
            const initialLength = user.enrolledCourses.length;

            // Check if the course is already enrolled
            const isAlreadyEnrolled = user.enrolledCourses.some(enrolledCourse =>
                enrolledCourse._id.equals(course._id)
            );

            if (isAlreadyEnrolled) {
                return res.status(400).json({ message: "Course is already enrolled" });
            }


            // Step 2: Add the course using $addToSet
            const updateResult = await User.updateOne(
                { _id: user._id },
                { $addToSet: { enrolledCourses: { _id: course._id, lessonCompleted: 0 } } }
            );

            // Step 3: Fetch the updated user to check the new length
            const updatedUser = await User.findById(user._id);
            const newLength = updatedUser.enrolledCourses.length;

            // Step 4: If the length increased, increment activeCourses
            if (newLength > initialLength) {
                await User.updateOne(
                    { _id: user._id },
                    { $inc: { activeCourses: 1 } }
                );
            }

            res.status(200).json({ message: "Course added successfully", data: course });
        } else {
            console.log("User not found.");
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/getCertificates", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.userName });
        if (!user) {
            console.log("User not found.");
            res.status(404).json({ message: "User not found" });
        }

        else {
            const certificates = user.certificates;

            // console.log(Array.isArray(certificates), " ", certificates[0].instructorName);
            res.status(200).json({ message: "Enrolled Courses fetched successfully", data: { certificates } });
        }
    }
    catch (err) {
        console.log("Error during course fetching:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add getUserFeedback endpoint
app.post("/getUserFeedback", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.userName });
        if (!user) {
            console.log("User not found.");
            return res.status(404).json({ message: "User not found" });
        }

        const feedback = user.feedback || [];
        res.status(200).json({ message: "Feedback fetched successfully", data: { feedback } });
    }
    catch (err) {
        console.log("Error fetching feedback:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add addFeedback endpoint
app.post("/addFeedback", async (req, res) => {
    try {
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
            console.log("User not found.");
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Feedback added successfully",
            data: { feedback: user.feedback }
        });
    }
    catch (err) {
        console.log("Error adding feedback:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
