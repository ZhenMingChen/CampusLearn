# CampusLearn

Full-stack e-learning app for SEN371 Final Project.

---

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
- **Quality:** Helmet, CORS allow-list, rate limiting, Joi validation, error handler, upload limits, **gzip compression**
- **Integrations:** Twilio WhatsApp (notify on file upload / test endpoint)
- **Docs:** **Swagger UI** (OpenAPI) for live, interactive API docs

---

## Stack
- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT
- **Frontend:** React (Vite), Tailwind CSS

---

## Prerequisites
- Git, Node.js ≥ 18, PostgreSQL ≥ 14
- (Recommended) VS Code + extensions: Prisma, Tailwind CSS IntelliSense, ESLint, Prettier

---

## Environment

Create env files from the examples:

```bash
# Backend env (the server reads this)
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL and (optional) TWILIO_* keys

# (optional) frontend env
cd ../frontend
cp .env.example .env


