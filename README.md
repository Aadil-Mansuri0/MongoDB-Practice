# MongoDB Practice

MongoDB practical exercises completed using `mongosh`.

## Practical Files

| No. | File | Topic |
|---|---|---|
| 01 | `01-studentDB.js` | Student database, arrays and embedded objects |
| 02 | `02-ecommerceDB.js` | E-commerce products, arrays and embedded seller objects |
| 03 | `03-hospitalDB.js` | Hospital patients, medicine arrays and embedded doctor objects |
| 04 | `04-employeeDB.js` | Employee records, skills arrays and embedded contact objects |
| 05 | `05-mongodb-basics.js` | Basic database, collection, insertion, display and count operations |
| 06 | `06-poornimaCollegeDB.js` | Poornima College Student database with 15 documents |

## Concepts Covered

- Database creation with `use`
- Explicit collection creation with `db.createCollection()`
- `insertMany()`
- `find()` and `pretty()`
- `countDocuments()`
- Arrays
- Embedded documents / objects
- Basic MongoDB document structure

## Run

Open MongoDB Shell (`mongosh`) and execute any `.js` file according to the practical requirement.

Example:

```javascript
load("01-studentDB.js")
```

For the sixth practical, the database is `poornimaCollegeDB`, collection is `Student`, and the script inserts 15 student documents. The `address` field demonstrates an embedded object and `skills` demonstrates an array.
