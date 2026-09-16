# MongoDB Practice

A clean, beginner-friendly collection of MongoDB and `mongosh` JavaScript practicals covering databases, CRUD, query operators, update operators, arrays, nested documents, projection, sorting, and aggregation.

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

> **Important:** Scripts that insert or modify data should be run against a practice database/collection. Some scripts intentionally update or delete documents.

## Notes

- These are learning/practical scripts, not a production application.
- Random-data scripts generate different values on each run.
- `32-aggex-data-generation.js` recreates the `aggex` dataset; run it only when you intentionally want a fresh dataset.
- `33-aggregation-complete-practice.js` uses separate collections and includes its own supporting data, so it does not depend on the original `aggex` dataset.
- Never commit MongoDB Atlas connection strings, usernames, passwords, API keys, or other secrets to this repository.
