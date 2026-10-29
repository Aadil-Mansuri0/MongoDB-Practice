# Student Management & Performance API

A MongoDB final project using Node.js, Express and Mongoose. It demonstrates CRUD, validation, indexed queries, pagination, aggregation, automated API tests, deployment, replication and backup/recovery planning.

## Features

- CRUD endpoints for students and courses.
- Schema validation and duplicate-key handling.
- Course reference validation; blocks deleting courses with enrolled students.
- Filtered, sorted and paginated student search.
- Course-wise average, highest and lowest marks aggregation.
- Unique and compound indexes aligned to query patterns.
- Health endpoint, Helmet, request size limit and centralized errors.
- Integration tests using a temporary in-memory MongoDB server.
- Operational guide for explain plans, Atlas replica sets, backups and deployment.

## Deploy publicly (MongoDB Atlas + Render)

The repository includes a root-level `render.yaml` Blueprint. You must connect the database and create the hosting service once from your own accounts; do not publish credentials.

1. **Create a MongoDB Atlas database.** Create a free cluster and a dedicated database user with a strong password. In Atlas Network Access, allow the Render service's outbound IP ranges if you can determine them from the Render service dashboard. For a temporary coursework demo only, Atlas's `0.0.0.0/0` allowlist can be used if necessary; it exposes the database endpoint to all IP addresses, so use a strong database password, store no sensitive data, and remove the broad rule when no longer needed.
2. In Atlas, select **Connect → Drivers → Node.js** and copy the connection URI. Replace the password placeholder with the database user's password and set the database name to `student_performance`. Keep this URI private.
3. **Deploy on Render.** Open https://dashboard.render.com/ and sign in with GitHub. Choose **New → Blueprint**, select `Aadil-Mansuri0/MongoDB-Practice`, and let Render detect the root `render.yaml`. If asked for `MONGODB_URI`, enter the Atlas URI in the Render environment field. Never commit it into GitHub.
4. Create/deploy the Blueprint. Wait until Render reports the service is live, then open the service's public `onrender.com` URL. Visit `/api/health`; it should return HTTP 200 and `{"status":"ok","database":"connected",...}`.
5. Test the root endpoint at `/`. Use the documented API routes below to test CRUD.

**Important security note:** This coursework API currently has no authentication or authorization. Do not expose personal or confidential student data or use it as a production service. Render's free web services may sleep after inactivity, so the first request after idle time can be slow.

If deployment fails, check Render's deploy logs and confirm the `MONGODB_URI`, Atlas database user/password, and Atlas network access configuration. Do not share your database URI or password in an issue or chat.

## Run locally

Requirements: Node.js 20+, npm, and local MongoDB or MongoDB Atlas.

~~~bash
cd final-project-student-management-api
npm install
cp .env.example .env
~~~
Set MONGODB_URI in .env. Never commit a real .env file or share database credentials.

~~~bash
npm run check
npm test
npm run seed
npm start
~~~
API base URL: http://localhost:3000

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | / | API information |
| GET | /api/health | API/database health |
| POST | /api/students | Create student |
| GET | /api/students | List/filter/page students |
| GET | /api/students/:studentId | Read student |
| PATCH | /api/students/:studentId | Update allowed fields |
| DELETE | /api/students/:studentId | Delete student |
| GET | /api/students/stats/by-course | Course-wise performance |
| POST | /api/courses | Create course |
| GET | /api/courses | List/filter courses |
| GET | /api/courses/:courseCode | Read course |
| PATCH | /api/courses/:courseCode | Update course |
| DELETE | /api/courses/:courseCode | Delete course when no students are enrolled |

## Example requests

Create:
~~~bash
curl -X POST http://localhost:3000/api/students -H 'Content-Type: application/json' -d '{"studentId":"STU1007","name":"Isha Jain","email":"isha@example.com","semester":3,"department":"Computer Science","courseCode":"CS101","marks":90}'
~~~

Filter, sort and paginate:
~~~bash
curl 'http://localhost:3000/api/students?courseCode=CS101&sort=marks&page=1&limit=10'
~~~

Course statistics:
~~~bash
curl http://localhost:3000/api/students/stats/by-course
~~~

Update:
~~~bash
curl -X PATCH http://localhost:3000/api/students/STU1007 -H 'Content-Type: application/json' -d '{"marks":95}'
~~~

Delete:
~~~bash
curl -X DELETE http://localhost:3000/api/students/STU1007
~~~

## Performance, replication and backup

See docs/operations.md for index rationale, explain execution stats, replica-set strategy, backups and recovery. The `scripts/backup.sh` script creates a timestamped logical backup using `mongodump`; `scripts/restore-test.sh` restores into a separate test database by default and refuses to target the source database. Both require MongoDB Database Tools and environment variables. Review the scripts before use.

Important: running the API does not itself configure replication or automated backups. Those must be enabled and verified in the actual MongoDB deployment. No benchmark or live deployment is claimed until you complete the steps above.

## Tests

npm test runs integration tests against an isolated in-memory MongoDB server and may need network access on the first run to obtain its MongoDB binary. It does not connect to or modify your Atlas database.

## Structure

~~~text
final-project-student-management-api/
├── src/app.js
├── src/server.js
├── src/models/
├── src/routes/
├── scripts/seed.js
├── scripts/backup.sh
├── scripts/restore-test.sh
├── tests/api.test.js
├── docs/operations.md
├── .env.example
├── .gitignore
└── package.json
~~~

This is a coursework-ready foundation, not a fully production-hardened service. Add authentication, authorization, rate limiting and audit logging before exposing it publicly.
