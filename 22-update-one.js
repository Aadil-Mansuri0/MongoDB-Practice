// Part 22: updateOne()

use("sample02");

// updateOne() modifies only the first document matching the filter
db.products.updateOne(
  { category: "Laptop" },
  { $set: { featuredProduct: true } }
);
