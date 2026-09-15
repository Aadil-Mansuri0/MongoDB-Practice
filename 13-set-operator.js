// Part 07: $set Operator

use("sample02");

// Update price of Product 1
db.products.updateOne(
  { productId: 1 },
  { $set: { price: 2000 } }
);

// Update multiple fields of Product 2
db.products.updateOne(
  { productId: 2 },
  {
    $set: {
      price: 5000,
      stock: 25,
      rating: 4.5
    }
  }
);

// Set inStock = true for Samsung products
db.products.updateMany(
  { brand: "Samsung" },
  { $set: { inStock: true } }
);
