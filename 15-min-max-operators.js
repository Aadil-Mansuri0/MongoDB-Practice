// Part 09: $min and $max Operators

use("sample02");

// Set Product 10 price to 4000 only if current price is greater than 4000
db.products.updateOne(
  { productId: 10 },
  { $min: { price: 4000 } }
);

// Set Product 11 rating to 4.8 only if current rating is lower than 4.8
db.products.updateOne(
  { productId: 11 },
  { $max: { rating: 4.8 } }
);
