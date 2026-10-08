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

## Project Structure

```
cloud_based_freelancing_management/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py         # App configuration, JWT, CORS, and DB settings
│   │   ├── urls.py             # Root URL routing & API health check
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── accounts/               # Custom User, authentication, and profiles
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests.py
│   ├── projects/               # Projects CRUD, statistics, and assignment
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests.py
│   └── tasks/                  # Granular task management & progress tracking
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── permissions.py
│       └── tests.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js          # Vite config with /api proxy to Django (port 8000)
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             # React Router and route definitions
│       ├── index.css
│       ├── components/         # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── StatCard.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── PriorityBadge.jsx
│       │   ├── ProgressBar.jsx
│       │   ├── TaskModal.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── AlertBanner.jsx
│       ├── pages/              # View pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ClientDashboard.jsx
│       │   ├── FreelancerDashboard.jsx
│       │   ├── ProjectList.jsx
│       │   ├── ProjectDetails.jsx
│       │   ├── CreateProject.jsx
│       │   ├── EditProject.jsx
│       │   ├── TaskManagement.jsx
│       │   └── Profile.jsx
│       ├── services/           # HTTP API client integrations
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── projectService.js
│       │   └── taskService.js
│       ├── context/
│       │   └── AuthContext.jsx # Global JWT session & user state
│       └── hooks/
│           └── useAuth.js
├── .gitignore
└── README.md
```

---

## Environment Variables

### Backend Configuration (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```ini
# Django
SECRET_KEY=your-secure-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL Database Credentials
DB_ENGINE=django.db.backends.postgresql
DB_NAME=freelance_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> [!CAUTION]
> Never commit `.env` to Git. The `.gitignore` file is pre-configured to ignore all `.env` files.

---

## Local Setup & Installation (Windows)

### Prerequisites
- Python 3.12+ (or Windows Python launcher `py -3.12`)
- Node.js 18+ & npm
- PostgreSQL 14+ installed and running

### Step 1: Database Setup
Open **psql** or your PostgreSQL client (e.g. pgAdmin or PowerShell):

```powershell
# In PowerShell or psql:
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE freelance_db;"
```

### Step 2: Backend Setup

1. Open a PowerShell terminal in the project root:
   ```powershell
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   py -3.12 -m venv ..\venv
   ..\venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Create the `.env` file from the template:
   ```powershell
   Copy-Item .env.example .env
   # Open .env and set your DB_PASSWORD
   ```

5. Apply migrations:
   ```powershell
   python manage.py makemigrations accounts projects tasks
   python manage.py migrate
   ```

6. Run backend test suite:
   ```powershell
   python manage.py test accounts projects tasks --verbosity=2
   ```

7. Start the Django development server:
   ```powershell
   python manage.py runserver 8000
   ```
   The backend API will be live at `http://127.0.0.1:8000/api/`.

### Step 3: Frontend Setup

1. Open a new PowerShell terminal and navigate to `frontend`:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   The frontend application will be live at `http://localhost:5173/`.

---

## API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Register new Client or Freelancer account | No |
| `POST` | `/api/auth/login/` | Obtain JWT access & refresh tokens | No |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token | No |
| `GET` | `/api/auth/profile/` | Retrieve authenticated user profile | Yes (Bearer) |
| `PATCH` | `/api/auth/profile/` | Update profile information | Yes (Bearer) |
| `GET` | `/api/auth/freelancers/` | List registered active freelancers | Yes (Bearer) |

### Project Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects/` | List projects (filtered by role) | Yes (Bearer) |
| `POST` | `/api/projects/` | Create a new project | Yes (Client only) |
| `GET` | `/api/projects/<id>/` | Retrieve project details | Yes (Owner/Freelancer) |
| `PUT/PATCH`| `/api/projects/<id>/` | Update project details / status | Yes (Owner/Freelancer) |
| `DELETE` | `/api/projects/<id>/` | Delete project | Yes (Client owner only) |
| `GET` | `/api/projects/stats/` | Dashboard metrics for current user | Yes (Bearer) |

### Task Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/` | List tasks (supports `?project=`, `?status=`, `?priority=`) | Yes (Bearer) |
| `POST` | `/api/tasks/` | Create task for a project | Yes (Owner/Freelancer) |
| `GET` | `/api/tasks/<id>/` | Retrieve task details | Yes (Bearer) |
| `PUT/PATCH`| `/api/tasks/<id>/` | Update task details | Yes (Bearer) |
| `PATCH` | `/api/tasks/<id>/progress/` | Update task status & completion % | Yes (Bearer) |
| `DELETE` | `/api/tasks/<id>/` | Delete task | Yes (Client owner only) |

---

## Testing

Run the automated backend test suite:
```powershell
cd backend
..\venv\Scripts\python manage.py test accounts projects tasks --verbosity=2
```

Tests verify:
- Registration validation, role assignment, and password matching.
- JWT login and authenticated profile access.
- Client project creation, budget validation, and role restrictions.
- Freelancer assigned project retrieval and status update restrictions.
- Task lifecycle: creation, progress tracking, and access validation.

---

## Future DevOps Roadmap

The platform is architected for clean DevOps integration:
- **Docker**: Containerize backend (Gunicorn + Django) and frontend (Nginx SPA).
- **Jenkins CI/CD**: Automated pipeline running flake8/black, pytest/Django tests, npm build, and container registry publishing.
- **AWS Deployment**: Deploy using AWS EC2 with Amazon RDS (PostgreSQL) and Amazon S3 for static/media assets.
- **Monitoring**: AWS CloudWatch logs and metrics alarms.
