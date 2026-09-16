// Part 29: Aggregation Basics
// These examples mirror the aggregation operations performed in mongosh on db.aggex.

use("PCEA24CA001");

// 1. Group products by category
// Shows all distinct categories.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category"
    }
  }
]);

// 2. Count products by category
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 }
    }
  }
]);

// 3. Calculate average price by category
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 4. Calculate total revenue by category
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  }
]);

// 5. Calculate minimum and maximum price across all products
db.aggex.aggregate([
  {
    $group: {
      _id: null,
      minimumPrice: { $min: "$price" },
      maximumPrice: { $max: "$price" }
    }
  }
]);

// 6. Calculate average rating across all products
db.aggex.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" }
    }
  }
]);

// 7. Count the total number of products
db.aggex.aggregate([
  {
    $count: "totalProducts"
  }
]);

// 8. Sort all products by price in descending order
db.aggex.aggregate([
  {
    $sort: {
      price: -1
    }
  }
]);
