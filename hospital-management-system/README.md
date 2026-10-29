# Hospital Management System (Flask + MongoDB)

An educational hospital workflow and MongoDB DBMS project built with Flask, PyMongo, and a responsive server-rendered dashboard. It demonstrates CRUD operations, filtering, counts, aggregation pipelines, and `$lookup`.

> **Safety:** This is a college/demo project, not a production clinical system. It has no login or role-based access control. Use synthetic data only; never store real patient information.

## Features

- Dashboard metrics for patients, doctors, appointments, billing, and rooms
- Patient registration, search, and deletion
- Doctor directory and appointment scheduling
- Medical-records and prescriptions views\n- Billing summary and paid-revenue calculation
- Ward/bed overview
- Read-only MongoDB Query Lab: `find`, `countDocuments`, `$match`, `$group`, and `$lookup`
- Temporary in-memory demo mode if MongoDB is unavailable
- Health and statistics endpoints

## Setup

Requirements: Python 3.11+ and (optionally) MongoDB Community Server or MongoDB Atlas.

```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Open http://127.0.0.1:5000. Configure `MONGO_URI`, `DB_NAME`, and a strong random `SECRET_KEY` in `.env`. Never commit the private `.env` file. Demo mode is volatile and resets when the process restarts.

## Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard |
| `/patients` | Patient search and CRUD |
| `/doctors` | Doctor directory |
| `/appointments` | Appointment scheduling |\n| `/medical-records` | Medical records |\n| `/prescriptions` | Prescription list |
| `/billing` | Bills and paid revenue |
| `/rooms` | Ward/bed overview |
| `/queries` | MongoDB query lab |
| `/api/health` | Health status |
| `/api/stats` | Collection counts |
| `/api/patients` | Patient list API |

## Collections

`patients`, `doctors`, `appointments`, `medical_records`, `prescriptions`, `billing`, and `rooms`.

## Tests

```bash
python -m unittest discover -v
```

## Known limitations

No authentication, authorization, CSRF protection, audit logging, or production security hardening. Do not expose this educational app publicly with real patient data.