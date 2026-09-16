// Part 30: Aggregation Pipeline
// Complete pipeline examples based on the mongosh work performed on db.aggex.

use("PCEA24CA001");

// 1. Filter products by category
db.aggex.aggregate([
  {
    $match: {
      category: "Electronics"
    }
  }
]);

// 2. Filter products whose price is greater than 50,000
db.aggex.aggregate([
  {
    $match: {
      price: { $gt: 50000 }
    }
  }
]);

// 3. Group by category and calculate product count,
// average price, and total revenue in one pipeline.
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

// 4. Calculate total revenue by category and sort
// categories from highest to lowest revenue.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  }
]);

// 5. Find the top 5 categories by total revenue.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $sort: {
      totalRevenue: -1
    }
  },
  {
    $limit: 5
  }
]);

// 6. Find the 10 most expensive products.
db.aggex.aggregate([
  {
    $sort: {
      price: -1
    }
  },
  {
    $limit: 10
  }
]);

// 7. Complete pipeline: filter Electronics, group by brand,
// calculate product count, average price and total stock,
// then sort by average price descending.
db.aggex.aggregate([
  {
    $match: {
      category: "Electronics"
    }
  },
  {
    $group: {
      _id: "$brand",
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalStock: { $sum: "$stock" }
    }
  },
  {
    $sort: {
      averagePrice: -1
    }
  }
]);
