import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import CourseBrowser from './pages/CourseBrowser';
import LessonUploader from './pages/LessonUploader';
import SignInHandler from './pages/SignInHandler';
import Certificates from './pages/Certificates';
import Progress from './pages/Progress';
import Feedback from './pages/Feedback';

function App() {
  const [type, setType] = useState("signIn");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [LoggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('LoggedIn') == 'true';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') ? JSON.parse(localStorage.getItem('userName')) : null;
  });
  const [name, setName] = useState(() => {
    return localStorage.getItem('name') ? JSON.parse(localStorage.getItem('name')) : null;
  });
  const [userRole, setUserRole] = useState('student'); // or 'instructor'

  const handleOnClick = text => {
    if (text !== type) {
      setType(text);

      return;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userId="65ccf2c7a86b3ddd2f144f3e" userRole={userRole} />;
      case 'courses':
        return <CourseBrowser />;
      case 'progress':
        return <Progress />;
      case 'certificates':
        return <Certificates />;
      case 'feedback':
        return <Feedback />;
      case 'upload':
        return <LessonUploader />;
      case 'signInHandler':
        return <SignInHandler LoggedIn={LoggedIn} userName={userName} setUserName={setUserName} name={name} setName={setName} type={type} setLoggedIn={setLoggedIn} setActiveTab={setActiveTab} />;
      default:
        return <Dashboard userId="65ccf2c7a86b3ddd2f144f3e" userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Navigation */}
      <nav className="bg-white shadow-sm w-[98.6vw]">
        <div className="mx-10">
          <div className="flex justify-between h-16">
            <div className="flex gap-5">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">VocalMaster</h1>
              </div>
              <div className="sm:ml-6 sm:flex sm:space-x-8 ">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'dashboard'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'courses'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Browse Courses
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'progress'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  My Progress
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'certificates'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Certificates
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'feedback'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  Feedback
                </button>
              </div>
            </div>
            {
              LoggedIn ?
                <div className="flex items-center space-x-4">
                  {userRole === 'instructor' && (
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Upload Course
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUserRole(userRole === 'student' ? 'instructor' : 'student')
                      setActiveTab('dashboard');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Switch to {userRole === 'student' ? 'Instructor' : 'Student'} View
                  </button>
                  <button
                    className='bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold transition duration-300 shadow'
                    onClick={() => {
                      localStorage.removeItem('LoggedIn');
                      localStorage.removeItem('userName');
                      localStorage.removeItem('name');
                      setLoggedIn(false);
                    }}>
                    LogOut
                  </button>
                </div> :
                <>
                  <div className="space-x-4 relative flex m-2.5">
                    <button onClick={() => {
                      handleOnClick('signIn')
                      setActiveTab('signInHandler')
                    }} className="bg-indigo-600 text-white px-5 rounded-lg font-semibold transition duration-300 shadow cursor-pointer">Login</button>
                    <button onClick={() => {
                      handleOnClick('signUp')
                      setActiveTab('signInHandler')
                    }} className=" text-indigo-600 px-5 rounded-lg font-semibold transition duration-300 shadow cursor-pointer border border-indigo-600">Sign Up</button>
                  </div>
                </>
            }
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
