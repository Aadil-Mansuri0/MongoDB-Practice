# Deployment guide — Student Management API

This repository is a backend REST API built with Node.js 20+, Express, MongoDB and Mongoose. A GitHub repository link shows source code; it does not run the API by itself. Public hosting is complete only after the service has been deployed and its health endpoint verified.

## Run locally

Prerequisites: Node.js 20+ and npm, plus either a local MongoDB server or MongoDB Atlas.

~~~bash
git clone https://github.com/Aadil-Mansuri0/MongoDB-Practice.git
cd MongoDB-Practice/final-project-student-management-api
npm install
cp .env.example .env
~~~

Open `.env`. The example URI points to `mongodb://127.0.0.1:27017/student_performance`, which requires a local MongoDB server already running. If using Atlas, replace `MONGODB_URI` with the URI from Atlas → Connect → Drivers. Replace the password placeholder with the database user's password. Keep this URI secret; do not commit `.env`.

~~~bash
npm run check
npm test
npm run seed
npm start
~~~

`npm test` uses an isolated in-memory MongoDB server and may download a test binary on the first run. `npm run seed` writes sample course/student data to the configured database, so use a disposable development/demo database. `npm start` connects to MongoDB and starts the API.

Check:
- `http://localhost:3000/` — API information
- `http://localhost:3000/api/health` — expected HTTP 200 with `status: "ok"` and `database: "connected"`
- `http://localhost:3000/api/students` — student list
- `http://localhost:3000/api/courses` — course list
- `http://localhost:3000/api/students/stats/by-course` — aggregation results

## Deploy publicly with MongoDB Atlas + Render

### A. Create the database

1. Create/sign into MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
2. Create a cluster appropriate for a small demo.
3. In **Database Access**, create a database user with a strong unique password. This is separate from your Atlas login.
4. In **Network Access**, allow only appropriate client/host IPs where possible.
5. In the cluster's **Connect → Drivers**, copy the Node.js connection URI. Replace the password placeholder and use database name `student_performance`.
6. Keep the URI private; never paste it into source files, GitHub issues, or screenshots.

Atlas may reject Render connections if network access is not configured. Prefer a narrow allowlist based on the outbound IP information for your service. For a temporary coursework demo only, a broad `0.0.0.0/0` rule is sometimes used when a narrower rule is not practical; it allows connection attempts from anywhere and is less secure. If used, set a strong database password, store only non-sensitive demo data, and remove the broad rule as soon as practical. Do not use this shortcut for sensitive or production data.

### B. Deploy the repository

The repository includes a root-level `render.yaml` Blueprint definition.

1. Open https://dashboard.render.com/ and sign in with GitHub.
2. Select **New → Blueprint** (wording may vary).
3. Select `Aadil-Mansuri0/MongoDB-Practice` and the intended branch.
4. Review the detected `render.yaml`; its service root directory should be `final-project-student-management-api`.
5. When prompted, set `MONGODB_URI` to the Atlas URI using Render's environment-variable form. The URI should not be committed to GitHub. Set `NODE_ENV=production` if not already set.
6. Create/deploy the service and check the build/runtime logs until the deployment finishes.
7. Copy the actual HTTPS hostname assigned by Render. Do not invent or publish a placeholder URL as a live deployment.
8. Open the assigned URL followed by `/api/health`. Confirm HTTP 200, `status: "ok"`, and `database: "connected"`.
9. Open the root URL for API information and use Postman/curl to test CRUD routes.

Adding `render.yaml` only prepares the deployment. It does not create your Atlas cluster or Render service automatically. Do not claim the API is live until the host shows a successful deployment and the health endpoint confirms the database connection.

### C. Populate demo data

For demo records in the hosted database, run `npm run seed` from your local project with `MONGODB_URI` set to the Atlas demo database URI and your current IP allowed by Atlas. Alternatively, create course and student records through the POST endpoints. Do not seed a database containing data you need to preserve; sample IDs are upserted.

## API routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | API information |
| GET | `/api/health` | Database health |
| POST | `/api/courses` | Create course |
| GET | `/api/courses` | List courses; optional department filter |
| GET | `/api/courses/:courseCode` | Get course |
| PATCH | `/api/courses/:courseCode` | Update course fields |
| DELETE | `/api/courses/:courseCode` | Delete only if no enrolled students |
| POST | `/api/students` | Create student |
| GET | `/api/students` | List, filter, sort and paginate students |
| GET | `/api/students/:studentId` | Get student |
| PATCH | `/api/students/:studentId` | Update allowed fields |
| DELETE | `/api/students/:studentId` | Delete student |
| GET | `/api/students/stats/by-course` | Course-wise marks aggregation |

Example GET request (replace the hostname with your real Render URL):

~~~bash
curl "https://YOUR-RENDER-SERVICE.onrender.com/api/students?page=1&limit=10"
~~~

Create a course before creating a student that references it:

~~~bash
curl -X POST "https://YOUR-RENDER-SERVICE.onrender.com/api/courses" \
  -H "Content-Type: application/json" \
  -d '{"courseCode":"CS101","courseName":"Database Management Systems","department":"Computer Science","credits":4,"instructor":"Dr. Sharma"}'
~~~

~~~bash
curl -X POST "https://YOUR-RENDER-SERVICE.onrender.com/api/students" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"STU1007","name":"Isha Jain","email":"isha@example.com","semester":3,"department":"Computer Science","courseCode":"CS101","marks":90}'
~~~

The `YOUR-RENDER-SERVICE` hostname is a placeholder, not a live URL. The actual hostname comes from Render after deployment.

## Troubleshooting

- **`MONGODB_URI is required`:** set it in the Render service's environment settings and redeploy.
- **Connection timeout / `MongoServerSelectionError`:** check URI, database user/password, Atlas network access, and cluster state. URL-encode special characters in the password.
- **Health returns 503:** inspect Render runtime logs and verify Atlas connectivity.
- **Build failure:** check root directory and Node.js version (20+).
- **Empty GET results:** seed the intended demo database or use POST routes.
- **Slow first request after inactivity:** some free hosting plans sleep while idle.

## Security limitations

This educational API does not currently implement authentication/authorization. Do not store real personal student data or treat it as production-ready. Before production use, add authentication/authorization, rate limiting, stricter CORS, audit logging, secret rotation, and a data-retention policy. Configure and verify backups/replication separately; connecting to Atlas does not by itself prove that backup recovery has been tested.
