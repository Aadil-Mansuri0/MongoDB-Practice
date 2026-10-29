# Operations: performance, replication, backup and deployment

## Indexing and query performance

The schemas define:
- Unique students.studentId and students.email indexes.
- Compound students(courseCode, marks descending) for course filtering and ranked results.
- Compound students(department, semester) for common filters.
- Unique courses.courseCode and courses(department, courseName).

Inspect a representative query in mongosh:
~~~javascript
db.students.find({ courseCode: "CS101" }).sort({ marks: -1 }).explain("executionStats")
db.students.getIndexes()
~~~
Compare totalDocsExamined, totalKeysExamined and executionTimeMillis using realistic data. Indexes use storage and add write overhead; keep only indexes justified by query patterns. Production disables automatic index creation, so deploy indexes through a controlled migration.

## Replication strategy

For managed hosting, use a MongoDB Atlas replica-set cluster/tier that supports the required availability, and confirm the actual cluster topology in Atlas. Atlas manages replication and elections. Use the replica-set connection string, TLS, least-privilege database credentials, and restricted network access. Monitor replication lag, elections and provider alerts. Set write concern according to durability needs.

For a self-managed lab, follow the official MongoDB replica-set setup guide and test failover in a disposable environment. A single local mongod is not replication. Do not claim replication is configured merely because this API connects to MongoDB.

## Backup and recovery

Configure Atlas automated backups / point-in-time recovery according to the selected tier, retention and recovery objectives. Test restoring into a separate database or cluster periodically. A backup is not verified until a restore succeeds.

Logical backup example (MongoDB Database Tools must be installed):
~~~bash
mongodump --uri="$MONGODB_URI" --db=student_performance --out="./backups/$(date +%Y%m%d-%H%M%S)"
~~~

Restore to a separate test database first:
~~~bash
mongorestore --uri="$RESTORE_URI" --nsFrom='student_performance.*' --nsTo='student_performance_restore_test.*' ./backups/<timestamp>/student_performance
~~~
Verify collection counts, sample documents, indexes and critical queries. Encrypt backups, restrict access and keep copies separate from the database host. Never commit backups or credentials to Git.

## Deployment checklist

1. Create an Atlas database and least-privilege database user.
2. Set MONGODB_URI as a secret environment variable at the host; never commit .env.
3. Use Node.js 20+, install with npm install, start with npm start.
4. Restrict Atlas network access to the host or use private networking.
5. Check GET /api/health and test CRUD/aggregation after deployment.
6. Run integration tests in CI/staging, enable HTTPS, logs and alerts, and test a backup restore.
7. Rotate credentials if exposed.

## Production hardening

This is an educational API foundation. Before public production use, add authentication/authorization, rate limiting, stricter CORS, audit logging and a data-retention policy.
