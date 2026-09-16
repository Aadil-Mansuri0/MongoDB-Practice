// Part 28: Projection
// Demonstrates field inclusion/exclusion with find() and $project.

use("sample02");

// Include only selected fields.
db.products.find(
  { category: "Laptop" },
  { _id: 0, productId: 1, productName: 1, price: 1 }
);

// Exclude selected fields.
db.products.find(
  {},
  { _id: 0, seller: 0, createdAt: 0 }
);

// Aggregation projection is demonstrated in the independent aggregation file.
// Run 33-aggregation-complete-practice.js for the complete $project practice.
