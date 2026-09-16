// Part 23: updateMany()

use("sample02");

// updateMany() modifies every document matching the filter
db.products.updateMany(
  { category: "Mobile" },
  { $set: { categoryType: "Smartphone" } }
);
