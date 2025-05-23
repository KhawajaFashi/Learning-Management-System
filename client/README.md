# Edvora – Learning Management System (LMS)

**Edvora** is a modern Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to create, manage, and enroll in online courses with a sleek and responsive interface.

---

## 🚀 Tech Stack

- **Frontend**: React (with Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Deployment**:
  - Frontend: [Netlify](https://www.netlify.com/)
  - Backend: [Render](https://render.com/) or [Heroku](https://heroku.com)

---

## 🧑‍💻 Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/edvora.git
cd edvora
```

📦 Install Dependencies
-----------------------

### Backend
```bash
cd server  
npm install 
```
### Frontend
```
cd ../client  
npm install
```
🏃 Run the Application
----------------------

### Start Backend
```
cd server  
nodemon main.js   # or node server.js 
```

### Start Frontend
```
 cd client  
 npm run dev
```
Visit the app at: [http://localhost:5173](http://localhost:5173/)

🌐 Deployment
-------------

### Frontend on Netlify

1.  Push your code to GitHub.
    
2.  Go to [Netlify](https://app.netlify.com/) → New Site from Git.
    
3.  Select your repo.
    
4.  Set:
    
    *   **Build command**: npm run build
        
    *   **Publish directory**: client/dist
        
5.  Deploy.
    

### Backend on Render

1.  Go to [Render](https://render.com/).
    
2.  New Web Service → Connect GitHub → Select repo.
    
3.  Set:
    
    *   Root Directory: server
        
    *   Build Command: npm install
        
    *   Start Command: node server.js or npm start
        
    *   Environment Variables: Add those from .env
        

🔗 Connecting Frontend to Backend
---------------------------------

In your frontend React code (e.g., in api.js or services.js), use the full backend URL:
```
 const API_BASE_URL = "https://your-backend-url.onrender.com";  // Example API call
 fetch(`${API_BASE_URL}/api/courses`)
 .then(res => res.json())
 .then(data => console.log(data));
```
### ⚠️ CORS Setup in Backend

In server.js, add:
```
 const cors = require('cors');
 app.use(cors({    origin: 'https://your-frontend.netlify.app',  }));  
```
✅ Features
----------

*   User authentication with JWT
    
*   Role-based access (Admin, Instructor, Student)
    
*   Course creation & enrollment
    
*   RESTful API design
    
*   Responsive UI
    

🔍 Linting and Dev Tools
------------------------

This project uses [Vite](https://vitejs.dev/) for fast builds and HMR.

Plugins:

*   @vitejs/plugin-react for Babel + Fast Refresh
    
*   ESLint configuration included
    

> Consider switching to TypeScript for type safety in production environments.

🛠️ Built With
--------------

*   [React](https://reactjs.org/)
    
*   [Vite](https://vitejs.dev/)
    
*   [Express](https://expressjs.com/)
    
*   [MongoDB](https://www.mongodb.com/)
    
*   [Node.js](https://nodejs.org/)
    

🤝 Contributing
---------------

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

📄 License
----------

This project is licensed under the MIT License – see the [LICENSE](https://chatgpt.com/LICENSE) file for details.

👨‍🎓 Author
------------

**Khawaja** – [GitHub](https://github.com/your-username)
