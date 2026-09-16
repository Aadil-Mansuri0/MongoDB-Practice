// Part 29: Aggregation Basics

use("sample02");

// Count products by category
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 }
    }
  }
]);

// Calculate the average price of all products
db.products.aggregate([
  {
    $group: {
      _id: null,
      averagePrice: { $avg: "$price" }
    }
  }
]);
