// Part 28: Projection

use("sample02");

// Include only selected fields in the result
db.products.find(
  { category: "Laptop" },
  { _id: 0, productId: 1, productName: 1, price: 1 }
);

// Exclude selected fields from the result
db.products.find(
  {},
  { _id: 0, seller: 0, createdAt: 0 }
);

// Aggregation projection used in the aggex practice collection.
// Shows only product name, category, price and rating.
use("PCEA24CA001");

db.aggex.aggregate([
  {
    $project: {
      _id: 0,
      productName: 1,
      category: 1,
      price: 1,
      rating: 1
    }
  }
]);
