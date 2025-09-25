import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LessonUploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalLesson, setTotalLesson] = useState(0);
  const [content, setContent] = useState({
    type: 'video',
    url: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const handleFileChange = (e) => {
    setContent({ ...content, url: e.target.files[0] })
    console.log("In On Change: ", e.target.files[0]);
    e.target.value = "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const userName = JSON.parse(localStorage.getItem('userName'));
    const name = JSON.parse(localStorage.getItem('name'));
    console.log(userName, " Name: ", name);
    const lessonData = {
      name,
      title,
      description,
      totalLesson,
      videoUrl,
      userName
    };
    const formData = new FormData();
    formData.append("file", content.url);
    formData.append("upload_preset", "SE Project Video Upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drkljid4e/video/upload",
        formData
      );
      console.log("Response: ", response.data.secure_url);
      lessonData.videoUrl = response.data.secure_url;
      console.log("LessonData: ", lessonData);
      setVideoUrl(response.data.secure_url);

      const res = await axios.post(`${import.meta.env.Railway_URL}/course`, lessonData).then((response) => {
        console.log(response);
      })

      resetForm();
    } catch (error) {
      console.error("Upload failed:", error);
      setError(true)
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTotalLesson('');
    setContent({ type: 'video', url: null });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Lessons
          </label>
          <input
            type='number'
            value={totalLesson}
            onChange={(e) => setTotalLesson(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video
          </label>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="videoUploader"
          />

          {/* Custom Upload Button */}
          <button
            type="button"
            onClick={() => document.getElementById("videoUploader").click()}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none"
          >
            Select Video
          </button>

          {/* Display Selected File Name */}
          {content.url && (
            <p className="mt-2 text-[13px] font-bold text-gray-600">
              Selected File: {content.url.name}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            // onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px - 6 py - 2 rounded - lg text - white ${
        loading? 'bg-blue-400 cursor-not-allowed': 'bg-blue-500 hover:bg-blue-600'
      }`}
          >
            {/* {loading ? 'Saving...' : existingLesson ? 'Update Lesson' : 'Create Lesson'} */}
            {loading ? "Uploading..." : "Upload Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonUploader;
