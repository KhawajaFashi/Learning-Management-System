import axios from "axios";
import React from "react";

const CourseCard = ({ course }) => {
  const { _id, courseName, description, videoUrl, instructorName, totalLesson } = course;
  const handleEnroll = async () => {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const CourseEnroll = {
      _id,
      userName
    }
    const response = await axios.post("http://localhost:3000/enrollCourse", CourseEnroll).then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log("Error Detected: ", err);
    })
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      {/* Course Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">{courseName}</h1>

      {/* Course Progress Info */}
      <p className=" mb-2"><span className="font-semibold">Instructor Name:</span> {instructorName}</p>
      <div className="text-sm text-gray-700 mb-4">
        <p className="font-medium">{description}</p>

      </div>
      <div className="text-sm text-gray-700 mb-4">
        <p>
          Total Lessons:{" "}
          <span className="font-bold">{totalLesson}</span>
        </p>
      </div>

      {/* Continue Button */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all"
        onClick={handleEnroll}
      >
        Start Learning
      </button>
    </div>
  );
};

export default CourseCard;
