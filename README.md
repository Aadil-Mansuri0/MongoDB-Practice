# MongoDB Practice

A clean, beginner-friendly collection of MongoDB and `mongosh` JavaScript practicals covering databases, CRUD, query operators, update operators, arrays, nested documents, projection, sorting, aggregation, and indexes.

## Repository Structure

The scripts are numbered in learning order. Each file focuses on one practical concept and uses comments to explain the operation being demonstrated.

## Practical Files

| No. | File | Topic |
|---:|---|---|
| 01 | `01-studentDB.js` | Student database, arrays and embedded documents |
| 02 | `02-ecommerceDB.js` | E-commerce products and embedded seller data |
| 03 | `03-hospitalDB.js` | Hospital records, medicine arrays and embedded doctor data |
| 04 | `04-employeeDB.js` | Employee records, skills arrays and embedded contact data |
| 05 | `05-mongodb-basics.js` | MongoDB database, collection, insert, display and count basics |
| 06 | `06-poornimaCollegeDB.js` | College student database with sample records |
| 07 | `07-database-and-collection.js` | Database selection and collection creation |
| 08 | `08-insert-students.js` | `insertMany()` with arrays and embedded documents |
| 09 | `09-find-students.js` | Basic `find()` queries |
| 10 | `10-comparison-operators.js` | `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`, `$in`, `$nin` |
| 11 | `11-logical-operators.js` | `$and`, `$or`, `$not`, `$nor` |
| 12 | `12-create-products.js` | Product collection and sample product data |
| 13 | `13-set-operator.js` | `$set` with `updateOne()` and `updateMany()` |
| 14 | `14-inc-operator.js` | `$inc` for numeric updates |
| 15 | `15-min-max-operators.js` | `$min` and `$max` update operators |
| 16 | `16-unset-operator.js` | `$unset` for removing fields |
| 17 | `17-array-operators.js` | `$push`, `$addToSet`, `$pop`, `$pull`, `$pullAll`, `$each`, `$position`, `$slice` |
| 18 | `18-nested-document-update.js` | Dot notation and nested document updates |
| 19 | `19-rename-operator.js` | `$rename` |
| 20 | `20-mul-operator.js` | `$mul` |
| 21 | `21-current-date-operator.js` | `$currentDate` |
| 22 | `22-update-one.js` | `updateOne()` |
| 23 | `23-update-many.js` | `updateMany()` |
| 24 | `24-replace-one.js` | `replaceOne()` |
| 25 | `25-delete-one.js` | `deleteOne()` |
| 26 | `26-delete-many.js` | `deleteMany()` |
| 27 | `27-sort-and-limit.js` | Sorting and limiting query results |
| 28 | `28-projection.js` | Field inclusion/exclusion and aggregation projection |
| 29 | `29-aggregation-basics.js` | Basic aggregation and group calculations |
| 30 | `30-aggregation-pipeline.js` | Multi-stage aggregation pipelines |
| 31 | `31-aggregation-advanced.js` | `$filter`, `$map`, `$reduce`, `$graphLookup`, buckets, sampling, `$out`, `$merge` |
| 32 | `32-aggex-data-generation.js` | Generates the 5,000-document `aggex` practice dataset |
| 33 | `33-aggregation-complete-practice.js` | Independent end-to-end aggregation practice set |
| 34 | `34-indexes.js` | Simple, compound, multikey, text, hashed, geospatial, unique/sparse, partial and wildcard indexes |
| 35 | `35-indexing-complete-practical.js` | End-to-end indexing practical: single-field, compound, ESR, multikey, explain, hint, hidden and unique indexes, error handling and index maintenance |
| 36 | `36-replication-complete-practical.js` | Replica-set setup, Primary/Secondary roles, read preference, read/write concern, replication health and elections/failover |
| 37 | `37-backup-and-recovery-complete-practical.md` | Full replica-set logical backups, oplog-aware restore, verification, RPO/RTO and disaster-recovery strategy |
| 38 | `38-student-management-performance-system.js` | Student Management & Performance System: two collections, seed data, marks update, course indexes and course-wise aggregation |

## Concepts Covered

### Database & Documents
- `use()` database selection
- `db.createCollection()`
- `insertOne()` / `insertMany()`
- `find()` / `findOne()`
- Arrays
- Embedded and nested documents

### Query Operators
- Comparison: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`, `$in`, `$nin`
- Logical: `$and`, `$or`, `$not`, `$nor`
- Sorting with `sort()`
- Limiting with `limit()`
- Projection

### Update & CRUD
- `$set`, `$inc`, `$min`, `$max`, `$unset`, `$rename`, `$mul`, `$currentDate`
- `$push`, `$addToSet`, `$pop`, `$pull`, `$pullAll`
- `$each`, `$position`, `$slice`
- Dot notation for nested updates
- `updateOne()`, `updateMany()`, `replaceOne()`
- `deleteOne()`, `deleteMany()`

### Aggregation
The repository includes the practical aggregation work and a separate independent comprehensive aggregation script.

Core stages demonstrated:
- `$match`, `$project`, `$group`, `$sort`, `$limit`, `$skip`
- `$unwind`, `$lookup`, `$count`
- `$addFields`, `$set`, `$unset`, `$replaceWith`
- `$sample`, `$bucket`, `$bucketAuto`
- `$out`, `$merge`
- `$graphLookup`

Array expressions demonstrated:
- `$filter`
- `$map`
- `$reduce`

Common accumulators/operators demonstrated:
- `$sum`, `$avg`, `$min`, `$max`
- `$first`, `$last`, `$push`, `$addToSet`
- `$multiply`

Aggregation examples include:
- Filtering products
- Category-wise counts, averages, and revenue
- Minimum/maximum price and average rating
- Top-N products
- Pagination with `$skip` + `$limit`
- Array expansion with `$unwind`
- Collection joins with `$lookup`
- Array processing with `$filter`, `$map`, and `$reduce`
- Recursive relationships with `$graphLookup`
- Random sampling
- Explicit and automatic price buckets
- Writing results with `$out` and `$merge`
- Complete multi-stage pipelines

### Student Management & Performance System

`38-student-management-performance-system.js` is a complete end-to-end project using the dedicated `StudentPerformanceDB` database and the `students` and `courses` collections. It seeds sample records idempotently, updates a student's marks, creates unique and compound indexes on `courses`, demonstrates `explain("executionStats")`, and uses `$lookup` / `$avg` / `$size` to report student count and average marks per course. It also includes an overall marks summary and a missing-course reference check.

Run with `mongosh`:

```javascript
load("38-student-management-performance-system.js")
```

The script does not drop or recreate collections. Sample records are inserted with stable IDs, so reruns do not duplicate the seed data. The marks update is repeatable and sets the same final value.

### Backup and Recovery

`37-backup-and-recovery-complete-practical.md` is a command-line practical guide for replica-set backups and restores using MongoDB Database Tools. It covers `mongodump --oplog`, compatible `mongorestore --oplogReplay` workflows, safe test restores, recovery validation, RPO/RTO, backup retention, security and disaster-recovery planning.

**Prerequisites:** MongoDB Database Tools and a healthy replica set. These are terminal commands, not `mongosh` commands. Always restore to an isolated test deployment first; never test a recovery procedure against production data.

### Replication

`36-replication-complete-practical.js` is a hands-on local replica-set lab. It documents three local `mongod` members, `rs.initiate()`, Primary/Secondary roles, `rs.status()`, read preferences, read concern, write concern, replication lag inspection and a separate manual failover exercise. It uses the dedicated `MongoDBReplicationLab.orders` collection and does not drop that collection.

**Prerequisite:** A local MongoDB Server installation with three separate `mongod` processes. Read and follow the setup instructions at the top of the script before running it. The lab is for local learning, not production deployment.

### Indexes
`34-indexes.js` is an independent indexes practical that uses the `PCEA24CA001` database and a separate `indexProducts` collection. It demonstrates:
- Simple index
- Compound index
- Multikey index
- Text index
- Hashed index
- Geospatial `2dsphere` index
- Unique + sparse index
- Partial index
- Wildcard index
- `explain("executionStats")`, `getIndexes()`, and `dropIndex()`

The indexes practical creates its own 5,000-document dataset and does not intentionally modify the existing practice collections.

`35-indexing-complete-practical.js` is a focused indexing lesson using the dedicated `indexingLabProducts` collection in `PCEA24CA001`. It covers single-field and compound indexes, field order, the ESR (Equality, Sort, Range) guideline, multikey indexes, `explain("executionStats")`, `hint()`, hidden indexes, unique-index duplicate-key error handling, and index inspection/removal.

## Running the Scripts

Use MongoDB Shell (`mongosh`). For example:

```javascript
load("07-database-and-collection.js")
```

For the 5,000-document aggregation dataset:

```javascript
load("32-aggex-data-generation.js")
```

For the independent complete aggregation practice:

```javascript
load("33-aggregation-complete-practice.js")
```

For the indexes practical:

```javascript
load("34-indexes.js")
```

For the focused complete indexing lesson:

```javascript
load("35-indexing-complete-practical.js")
```

For the replication practical (after starting and initiating the local replica set):

```javascript
load("36-replication-complete-practical.js")
```

For the Student Management & Performance System project:

```javascript
load("38-student-management-performance-system.js")
```

For the backup and recovery guide, follow the terminal commands in the Markdown file (it is a guide, not a script to load in `mongosh`):

[`37-backup-and-recovery-complete-practical.md`](37-backup-and-recovery-complete-practical.md)

> **Important:** Scripts that insert or modify data should be run against a practice database/collection. Some scripts intentionally update or delete documents.

## Notes

- These are learning/practical scripts, not a production application.
- Several early seed scripts (`01`–`06`, `08`, and `12`) are intended as first-run examples and are not all idempotent; rerunning them may fail because a collection already exists or may insert duplicate sample records.
- Many operator demonstrations intentionally update documents, increment values, change arrays, or delete records. Re-seed/reset only the relevant practice collection before repeating a lesson when you need the original starting state.
- Random-data scripts generate different values on each run.
- `32-aggex-data-generation.js` recreates the `aggex` dataset; run it only when you intentionally want a fresh dataset.
- `33-aggregation-complete-practice.js` uses separate collections and includes its own supporting data, so it does not depend on the original `aggex` dataset. **Warning:** each run drops and recreates `aggregationProducts`, `aggregationCustomers`, and `aggregationSellers` in `PCEA24CA001`; back up any data in those exact collections before running it.
- `31-aggregation-advanced.js` also drops and rebuilds `aggregationSellers` for its `$graphLookup` example. Back up that exact collection first if it contains anything you need.
- `34-indexes.js` recreates only the `indexProducts` practice collection when run; other collections in `PCEA24CA001` are not intentionally modified.
- Never commit MongoDB Atlas connection strings, usernames, passwords, API keys, or other secrets to this repository.
