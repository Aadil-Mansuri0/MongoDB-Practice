# Repository Guide — MongoDB Practice

## Main runnable project

The primary backend project in this repository is **Student Management & Performance API**.

- Project source and features: [`final-project-student-management-api/`](./final-project-student-management-api/)
- Run instructions and API endpoints: [`final-project-student-management-api/README.md`](./final-project-student-management-api/README.md)
- Full local setup + cloud deployment guide: [`final-project-student-management-api/docs/deployment.md`](./final-project-student-management-api/docs/deployment.md)
- Performance, index, backup and replication notes: [`final-project-student-management-api/docs/operations.md`](./final-project-student-management-api/docs/operations.md)
- CI checks: [GitHub Actions workflow](./.github/workflows/student-management-api.yml)
- Render deployment blueprint: [`render.yaml`](./render.yaml)

## Technology stack

Node.js 20+, Express, MongoDB, Mongoose, REST API, automated tests with Node's test runner, Supertest and an in-memory MongoDB instance.

## Quick start

~~~bash
git clone https://github.com/Aadil-Mansuri0/MongoDB-Practice.git
cd MongoDB-Practice/final-project-student-management-api
npm install
cp .env.example .env
~~~

Edit `.env` and set `MONGODB_URI` to a working MongoDB connection. The sample URI expects MongoDB to be running locally; it does not start the database automatically. Keep credentials out of Git.

~~~bash
npm run check
npm test
npm run seed
npm start
~~~

Visit `http://localhost:3000/` and `http://localhost:3000/api/health`. For public hosting, create a MongoDB Atlas database and deploy through Render using `render.yaml`. Follow the deployment guide and do not claim a live URL until you have deployed and verified `/api/health`.

## Project status and limitations

The repository contains the API source code, automated tests and hosting configuration. Hosting configuration does not mean a public instance is already running. The actual public URL is assigned only after you deploy it from your own Render account and connect a working database.

This is an educational project. Authentication and authorization are not implemented, so do not store sensitive or real student records. Do not commit `.env`, credentials, or backups.
