<img width="864" height="422" alt="image" src="https://github.com/user-attachments/assets/9e241706-bc9e-450a-ad9e-69f62d59f385" />
<img width="863" height="425" alt="image" src="https://github.com/user-attachments/assets/8baea581-830e-416b-87ef-79145dcf350b" />
<img width="864" height="423" alt="image" src="https://github.com/user-attachments/assets/fcd88d57-2cc5-467c-a0a9-131603806764" />
<img width="863" height="428" alt="image" src="https://github.com/user-attachments/assets/150b2169-911c-4e90-a615-1459ec30699b" />
<img width="864" height="443" alt="image" src="https://github.com/user-attachments/assets/7a1e1134-805b-44ed-8182-a0730f4de48d" />








# 🚀 SkillLink – Freelance Marketplace Web Application

## 📌 Project Overview

SkillLink is a full-stack web application that connects clients with freelancers. It allows clients to post jobs and freelancers to apply by submitting proposals. The system is built using Node.js, Express.js, MongoDB, EJS, and Bootstrap, following RESTful API principles.

This project demonstrates modern web development practices including authentication, database relationships, dynamic rendering, and responsive UI design.

---

## 🎯 Objectives

* Design and implement a RESTful API
* Perform CRUD operations using MongoDB
* Build dynamic web pages using EJS
* Create responsive UI using Bootstrap
* Simulate a real-world freelance marketplace

---

## 🛠️ Technologies Used

### 🔹 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* dotenv
* bcryptjs

### 🔹 Frontend

* EJS (Embedded JavaScript Templates)
* Bootstrap 5

### 🔹 Tools

* MongoDB Compass
* VS Code
* Git & GitHub

---

## 🧩 Features

### 👤 1. User Authentication

* User registration and login
* Password hashing using bcrypt
* Role-based system (Client / Freelancer)

---

### 💼 2. Job Management (CRUD)

* Create job postings
* View all jobs
* View job details
* Update job
* Delete job

Each job contains:

* Title
* Description
* Budget
* Status

---

### 📩 3. Proposal System

* Freelancers can apply to jobs
* Submit:

  * Cover letter
  * Bid amount
* Clients can:

  * Accept proposals
  * Reject proposals

---

### 🔄 4. Job Workflow

* Job status management:

  * Open
  * In Progress
  * Completed

---

### 🔍 5. Search & Filtering (Extra Feature)

* Search jobs by title
* Filter jobs by status or budget

---

### 👥 6. Role-Based Access Control

* Clients:

  * Post and manage jobs
* Freelancers:

  * View and apply to jobs

---

### 🎨 7. Dynamic Views (EJS)

* Server-side rendering using EJS
* Dynamic job listings and dashboards

---

### 📱 8. Responsive UI (Bootstrap)

* Mobile-friendly layout
* Components used:

  * Forms
  * Tables
  * Cards
  * Buttons

---

## 🗄️ Database Design

### Collections:

* Users
* Jobs
* Proposals

### Relationships:

* One user → many jobs
* One job → many proposals

---

## 🔗 API Endpoints

### 🔐 Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

### 💼 Jobs

| Method | Endpoint      | Description    |
| ------ | ------------- | -------------- |
| GET    | /api/jobs     | Get all jobs   |
| POST   | /api/jobs     | Create job     |
| GET    | /api/jobs/:id | Get single job |
| PUT    | /api/jobs/:id | Update job     |
| DELETE | /api/jobs/:id | Delete job     |

---

### 📩 Proposals

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | /api/proposals            | Submit proposal         |
| GET    | /api/proposals/job/:jobId | Get proposals for a job |
| PUT    | /api/proposals/:id        | Accept/Reject proposal  |

---

## ⚙️ Project Structure

```
skilllink/
│
├── models/
├── routes/
├── controllers/
├── middleware/
├── config/
├── views/
├── public/
├── app.js
├── package.json
└── .env
```

---

## 🧠 Concepts Used

### ✔ RESTful API Design

* Proper HTTP methods (GET, POST, PUT, DELETE)
* Structured endpoints
* JSON responses

---

### ✔ MVC Architecture

* Models → database schema
* Routes → API endpoints
* Controllers → business logic

---

### ✔ Authentication & Security

* Password hashing using bcrypt
* Role-based access

---

### ✔ Database Integration

* MongoDB with Mongoose
* Schema validation
* Data relationships

---

### ✔ Server-Side Rendering

* EJS for dynamic HTML generation

---

### ✔ Responsive Design

* Bootstrap for UI components and layout

---

### ✔ Error Handling

* Try-catch blocks
* Proper HTTP status codes

---

## ▶️ How to Run the Project

### 1. Clone Repository

```
git clone https://github.com/your-username/skilllink.git
cd skilllink
```

---

### 2. Install Dependencies

```
npm install
```

---

### 3. Setup Environment Variables

Create `.env` file:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/skilllinkDB
```

---

### 4. Start MongoDB

Ensure MongoDB is running locally.

---

### 5. Run Application

```
npm run dev
```

---

### 6. Open in Browser

```
http://localhost:3000
```

---

## 🌟 Future Improvements

* Real-time chat system
* Payment integration
* Notifications (email/SMS)
* Profile management
* AI-based job matching

---

## 🏆 Conclusion

SkillLink is a complete full-stack web application that demonstrates real-world system design using REST APIs, database integration, and dynamic UI rendering. It is scalable, maintainable, and suitable for portfolio and academic submission.

---

## 👨‍💻 Author

Your Name Aiman Fatima 
Registration Number SP23-BSE-029
BS Software Engineering – 7th Semester

---
