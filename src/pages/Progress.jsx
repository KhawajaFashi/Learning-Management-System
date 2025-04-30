import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Progress = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [activeCourses, setActiveCourses] = useState(0);
    const [courseCompleted, setCourseCompleted] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completionData, setCompletionData] = useState([]);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const userName = JSON.parse(localStorage.getItem('userName'));
                const data = { userName };

                // Fetch courses
                const response = await axios.post("/api/getEnrolledCourses", data);
                const { enrolledCourses, activeCourses, courseCompleted } = response.data.data;

                setEnrolledCourses(enrolledCourses);
                setActiveCourses(activeCourses);
                setCourseCompleted(courseCompleted);

                // Fetch details for each enrolled course
                const courseDetailsPromises = enrolledCourses.map(course =>
                    axios.post("/api/getCourseById", course)
                );

                const courseDetailsResponses = await Promise.all(courseDetailsPromises);
                const courseDetailsData = courseDetailsResponses.map((res, index) => ({
                    ...res.data.data,
                    lessonCompleted: enrolledCourses[index].lessonCompleted
                }));

                setCourseDetails(courseDetailsData);

                // Fetch certificates
                const certificatesResponse = await axios.post("/api/getCertificates", data);
                const userCertificates = certificatesResponse.data.data.certificates || [];
                setCertificates(userCertificates);

                // Generate completion date data based on certificates
                processCompletionData(userCertificates);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Process certificate data to create completion chart data
    const processCompletionData = (certificatesData) => {
        if (!certificatesData || certificatesData.length === 0) {
            setCompletionData([]);
            return;
        }

        // Group certificates by completion date
        const dateMap = {};

        certificatesData.forEach(cert => {
            const date = cert.completionDate;
            if (date) {
                if (dateMap[date]) {
                    dateMap[date]++;
                } else {
                    dateMap[date] = 1;
                }
            }
        });

        // Convert to array format for chart
        const chartData = Object.keys(dateMap).map(date => ({
            date: date,
            count: dateMap[date]
        }));

        // Sort by date (most recent dates first)
        chartData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        // Take only the most recent 7 dates (or fewer if there aren't 7)
        const recentData = chartData.slice(0, 7).reverse();
        setCompletionData(recentData);
    };

    // Calculate overall progress
    const calculateOverallProgress = () => {
        if (courseDetails.length === 0) return 0;

        const totalProgress = courseDetails.reduce((sum, course) => {
            return sum + (course.lessonCompleted / course.totalLesson);
        }, 0);

        return Math.round((totalProgress / courseDetails.length) * 100);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[98vw] ml-16">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Learning Progress</h1>

            {/* Progress Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-xl p-6 md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Overall Progress</h2>
                    <div className="flex items-center mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-5 mr-4">
                            <div
                                className="bg-indigo-600 h-5 rounded-full transition-all duration-300"
                                style={{ width: `${calculateOverallProgress()}%` }}
                            />
                        </div>
                        <span className="text-lg font-bold text-indigo-600">
                            {calculateOverallProgress()}%
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-indigo-600">{enrolledCourses.length}</p>
                            <p className="text-gray-700">Total Courses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-indigo-600">{activeCourses - courseCompleted}</p>
                            <p className="text-gray-700">Active Courses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-indigo-600">{courseCompleted}</p>
                            <p className="text-gray-700">Courses Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Certificate Timeline</h2>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                    Course Completion
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {certificates.length} Certificates
                                </span>
                            </div>
                        </div>
                        {completionData.length > 0 ? (
                            <div className="flex h-40 items-end">
                                {completionData.map((item, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full mx-1 bg-indigo-600"
                                            style={{
                                                height: `${item.count * 40}px`,
                                                borderRadius: '3px'
                                            }}
                                        ></div>
                                        <span className="text-xs mt-1 text-center">{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center">
                                <p className="text-gray-500">No certificates earned yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Course Progress Details */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course Progress Details</h2>
            <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Instructor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lessons
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courseDetails.map((course, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{course.instructorName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full"
                                                style={{ width: `${(course.lessonCompleted / course.totalLesson) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {Math.round((course.lessonCompleted / course.totalLesson) * 100)}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.lessonCompleted} / {course.totalLesson}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.lessonCompleted === course.totalLesson
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {course.lessonCompleted === course.totalLesson ? 'Completed' : 'In Progress'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Learning Streak</h2>
                    <div className="flex items-center">
                        <div className="p-4 bg-indigo-100 rounded-full mr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-800">{Math.floor(Math.random() * 10) + 1} days</p>
                            <p className="text-gray-600">Keep learning to increase your streak!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Next Goal</h2>
                    <div className="flex items-center">
                        <div className="p-4 bg-indigo-100 rounded-full mr-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-800">Complete all active courses</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full"
                                    style={{ width: `${(courseCompleted / (activeCourses)) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-600 mt-1">
                                {courseCompleted} / {activeCourses} courses completed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;