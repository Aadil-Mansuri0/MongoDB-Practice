// Part 20: $mul Operator

use("sample02");

// Multiply Product 2 price by 2
db.products.updateOne(
  { productId: 2 },
  { $mul: { price: 2 } }
);

// Multiply Product 3 stock by 2
db.products.updateOne(
  { productId: 3 },
  { $mul: { stock: 2 } }
);
