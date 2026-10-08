# Cloud-Based Freelance Project Management Platform

A modern, production-grade full-stack web application designed for managing freelance project lifecycles, budgets, deadlines, and deliverables with dedicated role-based workspaces for **Clients** and **Freelancers**.

This application is built with clean architecture and separation of concerns, serving as a real portfolio project ready for demonstration of DevOps practices including **Git/GitHub**, **Docker**, **Jenkins CI/CD**, **AWS EC2**, and **CloudWatch monitoring**.

---

## Architecture Overview

```
                          ┌────────────────────────────┐
                          │   React 18 + Vite (SPA)    │
                          │     (Port 5173 / Web)      │
                          └─────────────┬──────────────┘
                                        │
                                        │ REST API / JWT (Bearer)
                                        ▼
                          ┌────────────────────────────┐
                          │  Django REST Framework API │
                          │     (Port 8000 / WSGI)     │
                          └─────────────┬──────────────┘
                                        │
                                        │ psycopg2-binary
                                        ▼
                          ┌────────────────────────────┐
                          │     PostgreSQL Database    │
                          │         (Port 5432)        │
                          └────────────────────────────┘
```

---

## Features

### 1. Authentication & Role-Based Access Control
- Custom User model extending `AbstractUser`.
- User registration with role selection (**Client** or **Freelancer**).
- JWT Authentication (`access` and `refresh` tokens) via `djangorestframework-simplejwt`.
- Silent JWT token refresh mechanism on expired access tokens in the frontend Axios interceptor.
- Password strength validation and matching verification.
- Profile management with customizable bio, company name, skills, and contact info.

### 2. Client Workspace
- **Create Projects**: Set title, description, budget, deadline, and assign a talent.
- **Edit & Delete Projects**: Full ownership controls over deliverables.
- **Assign Freelancers**: Select from registered freelancers in real time.
- **Track Status**: Monitor project progression through `Pending`, `In Progress`, `Completed`, and `Cancelled`.
- **Client Dashboard**: Instant metrics on total projects, active projects, completed projects, pending projects, task counts, and total project spend.

### 3. Freelancer Workspace
- **View Assigned Projects**: Direct view of projects where the freelancer is assigned.
- **Status Updates**: Fast inline project status changes (`In Progress`, `Completed`).
- **Freelancer Dashboard**: Track assigned projects, active deliverables, and urgent deadlines.

### 4. Task Management
- Nested tasks linked directly to projects with foreign keys.
- **Task Priorities**: `Low`, `Medium`, `High`, `Urgent`.
- **Task Statuses**: `To Do`, `In Progress`, `In Review`, `Completed`.
- **Interactive Progress Slider**: 0% to 100% completion tracking with automatic state sync.
- Filter tasks by project, status, and priority.
- Search tasks in real time by title or description.

### 5. Search & Filtering
- Dynamic search across project titles and descriptions.
- Status filters (`pending`, `in_progress`, `completed`, `cancelled`).
- Task filtering by priority and status.

---

## Technology Stack

- **Backend**:
  - Python 3.12+
  - Django 5.x
  - Django REST Framework (DRF) 3.15+
  - SimpleJWT (`djangorestframework-simplejwt`)
  - PostgreSQL & `psycopg2-binary`
  - `django-cors-headers`
  - `python-dotenv`
- **Frontend**:
  - React 18
  - Vite 5
  - React Router DOM v6
  - Axios (with automatic token refresh interceptor)
  - Lucide React (modern SVG iconography)
  - Bootstrap 5 responsive styling
- **Database**:
  - PostgreSQL 14+ (Local service or AWS RDS)

---


## Future DevOps Roadmap

The platform is architected for clean DevOps integration:
- **Docker**: Containerize backend (Gunicorn + Django) and frontend (Nginx SPA).
- **Jenkins CI/CD**: Automated pipeline running flake8/black, pytest/Django tests, npm build, and container registry publishing.
- **AWS Deployment**: Deploy using AWS EC2 with Amazon RDS (PostgreSQL) and Amazon S3 for static/media assets.
- **Monitoring**: AWS CloudWatch logs and metrics alarms.
