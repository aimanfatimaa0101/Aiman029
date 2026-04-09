<img width="865" height="431" alt="image" src="https://github.com/user-attachments/assets/80276065-0757-4ecf-9556-e12cf60209df" />
<img width="864" height="401" alt="image" src="https://github.com/user-attachments/assets/07920d86-f08e-47e6-a9e8-baecf2d0c4df" />
<img width="863" height="429" alt="image" src="https://github.com/user-attachments/assets/f9123f0e-ea8e-48b1-be70-d28def436de8" />
<img width="864" height="396" alt="image" src="https://github.com/user-attachments/assets/13e0a318-d861-422d-b623-83a21a0ce98a" />
<img width="863" height="353" alt="image" src="https://github.com/user-attachments/assets/894f4bb3-7873-4535-bdf3-d46c268828e2" />
<img width="864" height="389" alt="image" src="https://github.com/user-attachments/assets/6e82870d-87d0-4c91-ade0-c39804db3609" />
<img width="864" height="381" alt="image" src="https://github.com/user-attachments/assets/169c6418-669a-4a4e-ab73-095809b344eb" />
<img width="864" height="393" alt="image" src="https://github.com/user-attachments/assets/9dd6bf5a-fe96-4f1b-b625-c3a8d11434e9" />
<img width="773" height="1127" alt="image" src="https://github.com/user-attachments/assets/eeff20ce-5202-4a17-b2c2-8685a3eb71c6" />















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
