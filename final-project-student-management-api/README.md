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
- Integration tests using a temporary in-memory MongoDB.
- Operational guide for explain plans, Atlas replica sets, backups and deployment.

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

See docs/operations.md for index rationale, explain execution stats, replica-set strategy, backup/recovery and deployment checklist. The `scripts/backup.sh` script creates a timestamped logical backup using `mongodump`; `scripts/restore-test.sh` restores into a separate test database by default and refuses to target the source database. Both require MongoDB Database Tools and environment variables. Review the scripts before use.

Important: running the API does not itself configure replication or automated backups. Those must be enabled and verified in the actual MongoDB deployment. No benchmark or live deployment is claimed.

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
├── package.json
└── README.md
~~~

This is a coursework-ready foundation, not a fully production-hardened service. Add authentication, authorization, rate limiting and audit logging before exposing it publicly.
