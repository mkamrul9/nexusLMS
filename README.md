# NexusLMS 🎓

Welcome to **NexusLMS**! This is a modern, lightweight, role-based Learning Management System designed to make handling assignments, grading, and course management a breeze. Whether you're an admin setting up the school year, a teacher grading papers, or a student tracking deadlines, this platform is built to get out of your way and let you focus on what matters.

## ✨ Features

We built NexusLMS around a strict Role-Based Access Control (RBAC) system. Depending on your login, you'll see a completely different dashboard tailored to your needs.

*   **👨‍💼 Admin Dashboard:**
    *   Create and manage new users (Students, Teachers, Admins).
    *   Create new courses.
    *   Assign teachers to specific courses.
    *   View system-wide statistics at a glance.

*   **🎓 Teacher Workspace:**
    *   Create assignments with titles, detailed descriptions, deadlines, and maximum points.
    *   Save assignments as drafts or publish them instantly to students.
    *   Review student submissions in a clean, split-view interface.
    *   Grade submissions and leave personalized feedback.

*   **📖 Student Portal:**
    *   View all active and past-due assignments.
    *   Submit answers directly through the built-in text editor.
    *   Track submission statuses (Pending, Submitted, Graded).
    *   Review grades and teacher feedback.

## 🛠️ Tech Stack

We went with a highly robust, decoupled architecture for this project.

**Frontend:**
*   **Next.js (App Router)** - For rapid React development and routing.
*   **Tailwind CSS** - For our beautiful, glassmorphic UI and responsive design.
*   **Axios** - Handling all our API requests and token interception.
*   **Lucide React** - For crisp, scalable SVG iconography.

**Backend:**
*   **ASP.NET Core 8.0 Web API** - The engine running the show.
*   **Entity Framework Core (EF Core)** - Our ORM for database interactions.
*   **PostgreSQL** - Our production database (via Npgsql).
*   **JWT Authentication** - Secure, stateless session management.
*   **Clean Architecture** - Separated into Domain, Application, Infrastructure, and API layers to keep our codebase highly maintainable.

## 📂 Folder Structure

The repository is split cleanly into frontend and backend ecosystems.

```
NexusLMS/
├── AssignmentSubmissionSystem.API/           # The entry point, Controllers, and middleware
├── AssignmentSubmissionSystem.Application/   # DTOs, business logic, and interfaces
├── AssignmentSubmissionSystem.Domain/        # Core entities (User, Course, Assignment, Submission)
├── AssignmentSubmissionSystem.Infrastructure/# EF Core DBContext, Migrations, and Token services
├── frontend/                                 # The Next.js React application
│   ├── src/
│   │   ├── app/                              # Pages and layouts (Auth, Admin, Teacher, Student)
│   │   ├── components/                       # Reusable UI components (Navbar, Footer, Cards)
│   │   └── lib/                              # Utility files (Axios config, types)
├── docs/                                     # Summary notes and documentation
└── Dockerfile                                # For deploying the backend to Render
```

## 🏃 How to Run Locally

Want to tinker with the code? Here's how to get it running on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+)
*   [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
*   A running instance of PostgreSQL (or you can swap the connection string to SQLite for quick testing).

### 1. Start the Backend
Navigate to the API folder, restore dependencies, and run it. The EF Core migrations will automatically create the database tables on startup!

```bash
cd AssignmentSubmissionSystem.API
dotnet restore
dotnet run
```
*The backend will typically start on `http://localhost:5000`.*

### 2. Start the Frontend
Open a new terminal window, navigate to the frontend folder, install packages, and boot up the dev server.

```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:3000`.*

### 3. Log In
Open your browser to `http://localhost:3000`. You can use the "Quick Demo Login" buttons to auto-fill credentials, or manually log in using the seed data credentials (e.g., `admin@demo.com` / `Password123!`).

## 🧗 Challenges & How We Overcame Them

Building a full-stack LMS from scratch is rarely a walk in the park. Here are a few hurdles we hit and how we solved them:

**1. The JWT Role Claim Trap**
Initially, we locked down our backend endpoints using `[Authorize(Roles = "Student")]`. However, ASP.NET Core expects a very specific, long-winded schema URI for role claims by default (`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`). Even though our JWT clearly said `"role": "Student"`, the framework rejected it and threw `403 Forbidden` errors, causing a frustrating login loop on the frontend. 
**Solution:** We audited the controllers, swapped the strict role bindings for a generic `[Authorize]` attribute to guarantee token validity, and shifted the heavy lifting of role-based protection to our frontend routing guards and manual endpoint checks.

**2. The Empty Production Database Problem**
When we finally deployed our backend to Render, we were hit with an unexpected `500 Internal Server Error` on the login page. It turned out that while Render successfully provisioned our free PostgreSQL database, the database was completely empty—the tables hadn't been created yet!
**Solution:** Rather than manually running CLI commands against the production database, we modified `Program.cs` to run `dbContext.Database.Migrate()` on application startup. Now, whenever the container boots up, it automatically provisions and updates the database schema for us.

## 🤝 Contributing

We'd love your help making NexusLMS even better! If you have an idea for a feature or found a bug:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some amazing feature'`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request!

If you're unsure where to start, take a look at the "Issues" tab. 

---
Built with ❤️ and a lot of coffee.
