import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feedback = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [userFeedback, setUserFeedback] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userName = JSON.parse(localStorage.getItem('userName'));
                const data = { userName };

                // Fetch enrolled courses
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/getEnrolledCourses`, data);
                const { enrolledCourses } = response.data.data;
                setEnrolledCourses(enrolledCourses);

                // Fetch details for each enrolled course
                const courseDetailsPromises = enrolledCourses.map(course =>
                    axios.post(`${import.meta.env.VITE_API_URL} / getCourseById`, course)
                );

                const courseDetailsResponses = await Promise.all(courseDetailsPromises);
                const courseDetailsData = courseDetailsResponses.map((res, index) => ({
                    ...res.data.data,
                    _id: enrolledCourses[index]._id,
                    lessonCompleted: enrolledCourses[index].lessonCompleted
                }));

                setCourseDetails(courseDetailsData);

                // Fetch user feedback
                const feedbackResponse = await axios.post(`${import.meta.env.VITE_API_URL}/getUserFeedback`, data);
                if (feedbackResponse.data.data && feedbackResponse.data.data.feedback) {
                    setUserFeedback(feedbackResponse.data.data.feedback);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [submitSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse || !feedbackText.trim()) {
            return;
        }

        try {
            setLoading(true);

            const userName = JSON.parse(localStorage.getItem('userName'));
            const selectedCourseObj = courseDetails.find(course => course._id === selectedCourse);

            const data = {
                userName,
                feedback: {
                    comment: feedbackText,
                    course: {
                        _id: selectedCourse,
                        courseName: selectedCourseObj.courseName
                    }
                }
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/addFeedback`, data);

            setFeedbackText('');
            setSelectedCourse('');
            setSubmitSuccess(!submitSuccess); // Toggle to trigger useEffect
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError(err.response?.data?.message || 'Error submitting feedback');
        } finally {
            setLoading(false);
        }
    };

    if (loading && userFeedback.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[98vw] ml-16">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Course Feedback</h1>

            {/* Feedback Form Section */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Share Your Thoughts</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Course
                        </label>
                        <select
                            id="courseSelect"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">-- Select a course --</option>
                            {courseDetails.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Feedback
                        </label>
                        <textarea
                            id="feedbackText"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Please share your experience with this course..."
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>

                    {error && (
                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </form>
            </div>

            {/* Previous Feedback Section */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Previous Feedback</h2>

            {userFeedback.length === 0 ? (
                <div className="bg-white shadow-md rounded-xl p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-gray-600">You haven't submitted any feedback yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userFeedback.map((feedback, index) => (
                        <div key={index} className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{feedback.course.courseName || 'Course'}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(feedback.createdAt || Date.now()).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p className="text-gray-700">{feedback.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feedback;