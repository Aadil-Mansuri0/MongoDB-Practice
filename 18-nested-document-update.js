// Part 12: Nested Document Update

use("sample02");

// Update a field inside the embedded seller document
db.products.updateOne(
  { productId: 1 },
  { $set: { "seller.sellerName": "Aadil Electronics" } }
);
