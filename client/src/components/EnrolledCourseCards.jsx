import axios from "axios";
import React, { useEffect, useState } from "react";

const EnrolledCourseCard = (props) => {
  let { _id, lessonCompleted } = props.course;
  const [courseTitle, setCourseTitle] = useState('');
  const [videoUrl, setvideoUrl] = useState('');
  const [courseInstructorName, setCourseInstructorName] = useState('');
  const [description, setDescription] = useState('');
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(lessonCompleted);

  useEffect(() => {
    const response = axios.post("http://localhost:3000/getCourseById", props.course).then((res) => {
      console.log(res);
      const { instructorName, courseName, description, totalLesson, videoUrl } = res.data.data;
      props.setTitle(courseName);
      setCourseTitle(courseName);
      setDescription(description);
      setCompletedLessons(completedLessons);
      props.setInstructorName(instructorName);
      setCourseInstructorName(instructorName);
      // const prog = (completedLessons / totalLesson) * 100;
      setvideoUrl(videoUrl);
      setTotalLessons(totalLesson);
      console.log("In User: ", courseName, '\n', description, '\n', videoUrl);
    })
  }, [])

  const handleClick = () => {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const data = { _id, userName };
    console.log("Data: ", data);
    if (completedLessons + 1 === totalLessons) {
      props.setCompletion(true);
      console.log("Inside if");
      axios.post("http://localhost:3000/updateCourseProgress", data).then((res) => {
        console.log("Inside posting data");
        console.log(res);
        setCompletedLessons(() => completedLessons + 1);
      });
      return;
    }
    else if (completedLessons === totalLessons)
      return;
    axios.post("http://localhost:3000/updateCourseProgress", data).then((res) => {
      console.log(res);
      setCompletedLessons(() => completedLessons + 1);
    })
  }

  const watchVideo = () => {
    let vid = document.querySelector('.card-video')
    vid.classList.toggle('hidden')
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      {/* Course Title */}
      <h3 className="text-3xl font-semibold text-gray-900 mb-2 block">{courseTitle}</h3>

      <p className=" mb-2"><span className="font-semibold">Instructor Name:</span> {courseInstructorName}</p>
      <div className="text-sm text-gray-700 mb-4">
        <p className="font-medium">{description}</p>

      </div>
      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
        />
      </div>

      {/* Course Progress Info */}
      <div className="text-sm text-gray-700 mb-4">
        <p className="font-medium">Progress: <span className="font-bold">{(completedLessons / totalLessons) * 100}%</span></p>
        <p>
          Lessons Completed:{" "}
          <span className="font-bold">{completedLessons}/{totalLessons}</span>
        </p>
      </div>

      {/* Continue Button */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all"
        onClick={handleClick}
      >
        Continue Learning
      </button>
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-all"
        onClick={watchVideo}
      >
        <video
          src={videoUrl}
          autoPlay
          className="card-video top-0 left-0 z-10 w-full h-full fixed hidden"
          controls
          preload="auto" // Helps with loading
          muted // Ensures autoplay works if needed
        >
        </video>
        Watch Video
      </button>
    </div>
  );
};

export default EnrolledCourseCard;
