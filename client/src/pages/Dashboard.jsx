import React, { useEffect, useState } from "react";
import EnrolledCourseCards from "../components/EnrolledCourseCards";
import axios from "axios";

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [completion, setCompletion] = useState(false);
  const [error, setError] = useState(null);
  const [ActiveCourses, setActiveCourses] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userName = JSON.parse(localStorage.getItem('userName'));
        const data = { userName };
        console.log("Data: ", data);

        // Fetch courses
        const coursesResponse = await axios.post(`${import.meta.env.VITE_API_URL}/getEnrolledCourses`, data).then((response) => {
          let { enrolledCourses, activeCourses, courseCompleted } = response.data.data;
          setEnrolledCourses(enrolledCourses);
          setActiveCourses(activeCourses);
          setCourseCompleted(courseCompleted);
          console.log("Response: ", response);
        });

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userName = JSON.parse(localStorage.getItem('userName'));
    const name = JSON.parse(localStorage.getItem('name'));
    const data = { userName, title, instructorName, name };
    console.log("Data: ", data);
    if (completion) {
      axios.post(`${import.meta.env.VITE_API_URL}/updateCourseCompletion`, data).then((res) => {
        console.log(res);
        setCourseCompleted(() => courseCompleted + 1);
        setCompletion(false);
      })
    }
  }, [completion]);

  console.log("Enrolled Courses: ", enrolledCourses, '\n', ActiveCourses, '\n', courseCompleted);

  return (
    <div className="p-6 max-w-[98vw] ml-16">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Learning Dashboard</h1>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">{ActiveCourses}</p>
              <p className="text-gray-700">Active Courses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">
                {courseCompleted}
              </p>
              <p className="text-gray-700">Courses Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <EnrolledCourseCards course={course} setCompletion={setCompletion} title={title} setTitle={setTitle} instructorName={instructorName} setInstructorName={setInstructorName} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
