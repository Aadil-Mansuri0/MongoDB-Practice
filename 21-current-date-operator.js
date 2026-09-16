// Part 21: $currentDate Operator

use("sample02");

// Add/update a lastUpdated field with the current date
db.products.updateOne(
  { productId: 4 },
  { $currentDate: { lastUpdated: true } }
);

// Store the current date as a BSON Date explicitly
db.products.updateOne(
  { productId: 5 },
  { $currentDate: { lastUpdated: { $type: "date" } } }
);
