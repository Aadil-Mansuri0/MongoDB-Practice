// Part 08: $inc Operator

use("sample02");

// Increase price of all Laptops by 500
db.products.updateMany(
  { category: "Laptop" },
  { $inc: { price: 500 } }
);

// Increase stock of all Mobiles by 10
db.products.updateMany(
  { category: "Mobile" },
  { $inc: { stock: 10 } }
);

// Decrease stock of Product 5 by 2
db.products.updateOne(
  { productId: 5 },
  { $inc: { stock: -2 } }
);
