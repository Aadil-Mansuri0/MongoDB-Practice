// Part 10: $unset Operator

use("sample02");

// Remove the rating field from Product 15
db.products.updateOne(
  { productId: 15 },
  { $unset: { rating: "" } }
);
