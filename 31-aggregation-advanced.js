// Part 31: Aggregation - Complete Practice Set
// Additional aggregation operations explicitly performed in mongosh on db.aggex.

use("PCEA24CA001");

// 1. Count all products.
db.aggex.aggregate([
  {
    $count: "totalProducts"
  }
]);

// 2. Find minimum and maximum product price.
db.aggex.aggregate([
  {
    $group: {
      _id: null,
      minimumPrice: { $min: "$price" },
      maximumPrice: { $max: "$price" }
    }
  }
]);

// 3. Find the average rating of all products.
db.aggex.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" }
    }
  }
]);

// 4. Count products in every category.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 }
    }
  }
]);

// 5. Find average price in every category.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" }
    }
  }
]);

// 6. Find total revenue in every category.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  }
]);

// 7. Combine count, average price, and total revenue by category.
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

// 8. Sort categories by total revenue in descending order.
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

// 9. Get the top 5 categories by revenue.
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

// 10. Get the 10 most expensive products.
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

// 11. Filter only Electronics products.
db.aggex.aggregate([
  {
    $match: {
      category: "Electronics"
    }
  }
]);

// 12. Filter products with price greater than 50,000.
db.aggex.aggregate([
  {
    $match: {
      price: { $gt: 50000 }
    }
  }
]);
