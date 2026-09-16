// Part 30: Aggregation Pipeline

use("sample02");

// Filter laptops, group them by brand, calculate average price,
// and sort the result by average price in descending order.
db.products.aggregate([
  {
    $match: { category: "Laptop" }
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
    $sort: { averagePrice: -1 }
  }
]);
