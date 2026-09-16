# MongoDB Practice

A collection of MongoDB practical exercises written as JavaScript scripts for `mongosh`.

The repository contains MongoDB practicals covering database and collection basics, CRUD operations, query operators, update operators, arrays, nested documents, sorting, projection, and aggregation.

## Practical Files

| No. | File | Topic |
|---|---|---|
| 01 | `01-studentDB.js` | Student database, arrays and embedded objects |
| 02 | `02-ecommerceDB.js` | E-commerce products, arrays and embedded seller objects |
| 03 | `03-hospitalDB.js` | Hospital patients, medicine arrays and embedded doctor objects |
| 04 | `04-employeeDB.js` | Employee records, skills arrays and embedded contact objects |
| 05 | `05-mongodb-basics.js` | Basic database, collection, insertion, display and count operations |
| 06 | `06-poornimaCollegeDB.js` | Poornima College student database with 15 documents |
| 07 | `07-database-and-collection.js` | Database selection and collection creation |
| 08 | `08-insert-students.js` | Inserting student documents with arrays and embedded objects |
| 09 | `09-find-students.js` | Basic `find()` operation |
| 10 | `10-comparison-operators.js` | `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne` |
| 11 | `11-logical-operators.js` | `$and`, `$or`, `$not`, `$nor` |
| 12 | `12-create-products.js` | Product collection and 50 product documents |
| 13 | `13-set-operator.js` | `$set` with `updateOne()` and `updateMany()` |
| 14 | `14-inc-operator.js` | `$inc` for increasing and decreasing numeric values |
| 15 | `15-min-max-operators.js` | `$min` and `$max` |
| 16 | `16-unset-operator.js` | `$unset` for removing a field |
| 17 | `17-array-operators.js` | `$push`, `$addToSet`, `$pop`, `$pull` |
| 18 | `18-nested-document-update.js` | Updating a field inside an embedded document |
| 19 | `19-rename-operator.js` | `$rename` for changing a field name |
| 20 | `20-mul-operator.js` | `$mul` for multiplying numeric field values |
| 21 | `21-current-date-operator.js` | `$currentDate` for storing the current date |
| 22 | `22-update-one.js` | `updateOne()` |
| 23 | `23-update-many.js` | `updateMany()` |
| 24 | `24-replace-one.js` | `replaceOne()` for replacing a complete document |
| 25 | `25-delete-one.js` | `deleteOne()` |
| 26 | `26-delete-many.js` | `deleteMany()` |
| 27 | `27-sort-and-limit.js` | Sorting with `sort()` and limiting with `limit()` |
| 28 | `28-projection.js` | Including and excluding fields with projection |
| 29 | `29-aggregation-basics.js` | Basic `$group` aggregation and accumulator operators |
| 30 | `30-aggregation-pipeline.js` | `$match`, `$group`, and `$sort` aggregation pipeline |

## Concepts Covered

### Database & Documents
- Database selection with `use()`
- Explicit collection creation with `db.createCollection()`
- `insertMany()` and `insertOne()`
- `find()`
- Arrays
- Embedded / nested documents

### Query Operators
- Comparison operators: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`
- Logical operators: `$and`, `$or`, `$not`, `$nor`
- Sorting with `sort()`
- Limiting results with `limit()`
- Projection

### Update & CRUD Operations
- `$set`
- `$inc`
- `$min`
- `$max`
- `$unset`
- `$rename`
- `$mul`
- `$currentDate`
- `$push`
- `$addToSet`
- `$pop`
- `$pull`
- Dot notation for nested document updates
- `updateOne()`
- `updateMany()`
- `replaceOne()`
- `deleteOne()`
- `deleteMany()`

### Aggregation
- `aggregate()`
- `$match`
- `$group`
- `$sum`
- `$avg`
- `$sort`
- Aggregation pipelines

## Run

Open MongoDB Shell (`mongosh`) and run a script with:

```javascript
load("07-database-and-collection.js")
```

For scripts that create or modify data, make sure the required database and collection exist before running them.

> **Note:** These scripts are practice exercises intended for learning MongoDB CRUD operations, query operators, update operators, and aggregation.