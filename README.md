# Assignment & Submission Management System

## Project Overview
A role-based school application built with Clean Architecture, ASP.NET Core, and Next.js.

## Tech Stack
* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Backend:** ASP.NET Core Web API (.NET 8), C#, Entity Framework Core
* **Database:** PostgreSQL

## Demo Credentials
* **Admin:** admin@demo.com / Password123!
* **Teacher:** teacher@demo.com / Password123!
* **Student:** student@demo.com / Password123!

## Local Setup Instructions
### 1. Database & Backend
1. Ensure PostgreSQL is running.
2. Clone the repository and navigate to the backend folder.
3. Update `appsettings.json` with your database password.
4. Run `dotnet ef database update --project AssignmentSubmissionSystem.Infrastructure --startup-project AssignmentSubmissionSystem.API` to create tables and seed demo data.
5. Run `dotnet run --project AssignmentSubmissionSystem.API`. The Swagger UI will be available at `http://localhost:5000/swagger`.

### 2. Frontend
1. Navigate to the frontend folder.
2. Run `npm install`.
3. Create a `.env.local` file based on `.env.example`.
4. Run `npm run dev`. Access the app at `http://localhost:3000`.

### 3. Running Tests
Navigate to the `AssignmentSubmissionSystem.Tests` folder and run `dotnet test`.
