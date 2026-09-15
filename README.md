# MongoDB Practice

A collection of MongoDB practical exercises written as JavaScript scripts for `mongosh`.

The repository contains earlier database practicals along with the latest practice work covering student queries, comparison and logical operators, product updates, array operators, and nested documents.

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

### Update Operators
- `$set`
- `$inc`
- `$min`
- `$max`
- `$unset`
- `$push`
- `$addToSet`
- `$pop`
- `$pull`
- Dot notation for nested document updates

## Run

Open MongoDB Shell (`mongosh`) and run a script with:

```javascript
load("07-database-and-collection.js")
```

For scripts that create or modify data, make sure the required database and collection exist before running them.

> **Note:** These scripts are practice exercises intended for learning MongoDB CRUD operations, query operators, and document updates.
