// Part 19: $rename Operator

use("sample02");

// Rename the productName field to name for Product 1
db.products.updateOne(
  { productId: 1 },
  { $rename: { productName: "name" } }
);

// Rename it back to keep the product schema consistent
db.products.updateOne(
  { productId: 1 },
  { $rename: { name: "productName" } }
);
