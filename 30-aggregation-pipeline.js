// Part 30: Aggregation Pipeline
// Complete aggregation pipeline work performed in mongosh on db.aggex.

use("PCEA24CA001");

// 1. Filter products by category.
db.aggex.aggregate([
  { $match: { category: "Electronics" } }
]);

// 2. Filter products whose price is greater than 50,000.
db.aggex.aggregate([
  { $match: { price: { $gt: 50000 } } }
]);

// 3. Group by category and calculate product count.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 }
    }
  }
]);

// 4. Group by category and calculate average price.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 5. Group by category and calculate total revenue.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  }
]);

// 6. Combine count, average price and total revenue by category.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalRevenue: { $sum: "$revenue" }
    }
  }
]);

// 7. Calculate total revenue by category and sort descending.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $sort: { totalRevenue: -1 } }
]);

// 8. Find the top 5 categories by total revenue.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 }
]);

// 9. Find the 10 most expensive products.
db.aggex.aggregate([
  { $sort: { price: -1 } },
  { $limit: 10 }
]);

// 10. Project only selected product fields.
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

// 11. Complete multi-stage pipeline: filter Electronics,
// group by brand, calculate count/average price/total stock,
// then sort by average price descending.
db.aggex.aggregate([
  { $match: { category: "Electronics" } },
  {
    $group: {
      _id: "$brand",
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalStock: { $sum: "$stock" }
    }
  },
  { $sort: { averagePrice: -1 } }
]);
