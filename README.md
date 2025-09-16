## Project Overview

**Problem.** Students and tutors struggle to coordinate questions, assignments, and learning materials in one place.

**Solution (CampusLearn).** A web platform where students create topics/questions, admins assign tutors, tutors reply, and everyone shares/consumes learning materials.

**Objectives.**
- Simple, secure **registration/login**
- **Topic creation** by students; **assignment** by admins
- **Tutor–student interactions** (reply threads)
- **Learning material uploads** with type/size limits

**Tech & Key Features.**
- **Frontend:** React + Vite + Tailwind (responsive, accessible UI)
- **Backend:** Node/Express + Prisma + PostgreSQL (RESTful API, JWT, role-based access)
- **Quality:** Helmet, rate-limit, validation (Joi), error handler, upload limits, CORS
- **Integrations:** Twilio WhatsApp (notify on file upload)

# CampusLearn

Full-stack e-learning app for SEN371 Final Project.

## Stack
- Backend: Node.js, Express, Prisma, PostgreSQL, JWT
- Frontend: React (Vite), Tailwind CSS

## Run locally
\\\ash
# Backend
cd backend
npm install
npx prisma migrate dev
node scripts/seed.js
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
\\\

## Demo accounts
- student@demo.dev / Passw0rd! (STUDENT)
- tutor@demo.dev   / Passw0rd! (TUTOR)
- admin@demo.dev   / Passw0rd! (ADMIN)
