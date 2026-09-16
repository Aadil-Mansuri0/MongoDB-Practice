// Part 33: Complete Aggregation Practice
// Uses separate practice collections so aggregation work does not modify the main sample data.

use("PCEA24CA001");

db.aggregationProducts.drop();
db.aggregationCustomers.drop();
db.aggregationSellers.drop();

const categories = ["Electronics", "Books", "Sports", "Furniture"];
const brands = ["NovaTech", "UrbanGear", "ReadMore", "HomeCraft"];
const cities = ["Jaipur", "Delhi", "Mumbai", "Pune"];
const colors = ["Black", "White", "Blue", "Red"];
const tags = ["new", "popular", "premium", "sale"];

const products = [];
for (let i = 1; i <= 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const price = Math.floor(Math.random() * 90000) + 1000;
  const quantity = Math.floor(Math.random() * 5) + 1;
  const stock = Math.floor(Math.random() * 200) + 1;
  const customerId = Math.floor(Math.random() * 20) + 1;

  products.push({
    productId: "AGG" + String(i).padStart(4, "0"),
    productName: brand + " Product " + i,
    category,
    brand,
    price,
    quantity,
    revenue: price * quantity,
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    stock,
    inStock: stock > 0,
    customerId,
    customer: {
      city: cities[Math.floor(Math.random() * cities.length)],
      age: Math.floor(Math.random() * 43) + 18
    },
    colors: [
      colors[Math.floor(Math.random() * colors.length)],
      colors[Math.floor(Math.random() * colors.length)]
    ],
    tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
    specifications: {
      color: colors[Math.floor(Math.random() * colors.length)],
      warrantyYears: Math.floor(Math.random() * 3) + 1
    }
  });
}

db.aggregationProducts.insertMany(products);

const customers = [];
for (let i = 1; i <= 20; i++) {
  customers.push({
    customerId: i,
    name: "Customer " + i,
    city: cities[Math.floor(Math.random() * cities.length)]
  });
}
db.aggregationCustomers.insertMany(customers);

// Supporting hierarchy for $graphLookup.
db.aggregationSellers.insertMany([
  { sellerName: "National", parentSeller: null, level: 0 },
  { sellerName: "North", parentSeller: "National", level: 1 },
  { sellerName: "South", parentSeller: "National", level: 1 },
  { sellerName: "Jaipur", parentSeller: "North", level: 2 },
  { sellerName: "Delhi", parentSeller: "North", level: 2 },
  { sellerName: "Mumbai", parentSeller: "South", level: 2 },
  { sellerName: "Pune", parentSeller: "South", level: 2 }
]);

print("Separate aggregation collections created successfully.");

// 1. $match
db.aggregationProducts.aggregate([
  { $match: { category: "Electronics" } }
]);
db.aggregationProducts.aggregate([
  { $match: { price: { $gt: 50000 } } }
]);

// 2. $project and $multiply
db.aggregationProducts.aggregate([
  {
    $project: {
      _id: 0,
      productName: 1,
      price: 1,
      quantity: 1,
      totalValue: { $multiply: ["$price", "$quantity"] }
    }
  }
]);

// 3. $group and accumulators: $sum, $avg, $min, $max, $first, $last, $push, $addToSet
db.aggregationProducts.aggregate([
  { $sort: { price: 1 } },
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      minimumPrice: { $min: "$price" },
      maximumPrice: { $max: "$price" },
      firstProduct: { $first: "$productName" },
      lastProduct: { $last: "$productName" },
      allBrands: { $push: "$brand" },
      uniqueBrands: { $addToSet: "$brand" }
    }
  }
]);

// 4. $sort, $limit, $skip
db.aggregationProducts.aggregate([{ $sort: { price: -1 } }]);
db.aggregationProducts.aggregate([{ $sort: { price: -1 } }, { $limit: 5 }]);
db.aggregationProducts.aggregate([{ $sort: { productId: 1 } }, { $skip: 10 }, { $limit: 10 }]);

// 5. $unwind
db.aggregationProducts.aggregate([
  { $unwind: "$colors" }
]);

// 6. $lookup
// Join aggregationProducts with aggregationCustomers.
db.aggregationProducts.aggregate([
  {
    $lookup: {
      from: "aggregationCustomers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerDetails"
    }
  },
  { $unwind: "$customerDetails" }
]);

// 7. $count
db.aggregationProducts.aggregate([
  { $count: "totalProducts" }
]);

// 8. $addFields and $set
db.aggregationProducts.aggregate([
  { $addFields: { totalValue: { $multiply: ["$price", "$quantity"] } } }
]);
db.aggregationProducts.aggregate([
  { $set: { totalValue: { $multiply: ["$price", "$quantity"] } } }
]);

// 9. $unset
db.aggregationProducts.aggregate([
  { $unset: ["customer", "specifications"] }
]);

// 10. $replaceWith
db.aggregationProducts.aggregate([
  {
    $replaceWith: {
      productId: "$productId",
      productName: "$productName",
      category: "$category",
      price: "$price"
    }
  }
]);

// 11. $sample
db.aggregationProducts.aggregate([
  { $sample: { size: 5 } }
]);

// 12. $bucket
db.aggregationProducts.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 10000, 25000, 50000, 75000, 100000],
      default: "100000+",
      output: {
        productCount: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    }
  }
]);

// 13. $bucketAuto
db.aggregationProducts.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5,
      output: {
        productCount: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    }
  }
]);

// 14. Array expressions: $filter
// Keep only the "premium" tags.
db.aggregationProducts.aggregate([
  {
    $project: {
      _id: 0,
      productId: 1,
      tags: 1,
      premiumTags: {
        $filter: {
          input: "$tags",
          as: "tag",
          cond: { $eq: ["$$tag", "premium"] }
        }
      }
    }
  }
]);

// 15. Array expressions: $map
// Convert every tag to uppercase.
db.aggregationProducts.aggregate([
  {
    $project: {
      _id: 0,
      productId: 1,
      tags: 1,
      upperCaseTags: {
        $map: {
          input: "$tags",
          as: "tag",
          in: { $toUpper: "$$tag" }
        }
      }
    }
  }
]);

// 16. Array expressions: $reduce
// Count array elements using an accumulator.
db.aggregationProducts.aggregate([
  {
    $project: {
      _id: 0,
      productId: 1,
      tags: 1,
      tagCount: {
        $reduce: {
          input: "$tags",
          initialValue: 0,
          in: { $add: ["$$value", 1] }
        }
      }
    }
  }
]);

// 17. $graphLookup
// Traverse the seller hierarchy recursively.
db.aggregationProducts.aggregate([
  {
    $set: {
      seller: {
        name: {
          $arrayElemAt: [
            ["Jaipur", "Delhi", "Mumbai", "Pune"],
            { $mod: [{ $toInt: { $substr: ["$productId", 3, 4] } }, 4] }
          ]
        }
      }
    }
  },
  {
    $graphLookup: {
      from: "aggregationSellers",
      startWith: "$seller.name",
      connectFromField: "parentSeller",
      connectToField: "sellerName",
      as: "sellerHierarchy"
    }
  },
  {
    $project: {
      _id: 0,
      productId: 1,
      "seller.name": 1,
      sellerHierarchy: 1
    }
  }
]);

// 18. $out
// Writes category totals to a derived collection.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $out: "aggregationCategorySummary" }
]);

// 19. $merge
// Merges category totals into another derived collection.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $merge: {
      into: "aggregationCategoryMerge",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);

// 20. Complete practical pipelines.
// Top 3 expensive Electronics products.
db.aggregationProducts.aggregate([
  { $match: { category: "Electronics" } },
  { $sort: { price: -1 } },
  { $limit: 3 },
  { $project: { _id: 0, productName: 1, price: 1 } }
]);

// Category revenue analysis.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalQuantity: { $sum: "$quantity" },
      averagePrice: { $avg: "$price" },
      minimumPrice: { $min: "$price" },
      maximumPrice: { $max: "$price" },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 }
]);

print("Complete aggregation practice finished successfully.");
