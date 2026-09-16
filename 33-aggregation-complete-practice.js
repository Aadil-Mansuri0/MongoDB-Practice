// Part 33: Complete Aggregation Pipeline Practice
// A separate collection: aggregationProducts
// Based on the supplied AGGREGATION PIPELINES study file.
// This file demonstrates the aggregation stages and operators listed there.

use("PCEA24CA001");

// ============================================================
// 0. CREATE A COMPLETELY SEPARATE COLLECTION
// ============================================================

db.aggregationProducts.drop();
db.aggregationCustomers.drop();

const aggregationCategories = ["Electronics", "Books", "Sports", "Furniture"];
const aggregationBrands = ["NovaTech", "UrbanGear", "ReadMore", "HomeCraft"];
const aggregationCities = ["Jaipur", "Delhi", "Mumbai", "Pune"];
const aggregationColors = ["Black", "White", "Blue", "Red"];

let aggregationDocs = [];

for (let i = 1; i <= 100; i++) {
  const category = aggregationCategories[Math.floor(Math.random() * aggregationCategories.length)];
  const brand = aggregationBrands[Math.floor(Math.random() * aggregationBrands.length)];
  const price = Math.floor(Math.random() * 90000) + 1000;
  const quantity = Math.floor(Math.random() * 5) + 1;
  const stock = Math.floor(Math.random() * 200) + 1;
  const customerId = Math.floor(Math.random() * 20) + 1;

  aggregationDocs.push({
    productId: "AGG" + String(i).padStart(4, "0"),
    productName: brand + " Product " + i,
    category: category,
    brand: brand,
    price: price,
    quantity: quantity,
    revenue: price * quantity,
    rating: Number((Math.random() * 4 + 1).toFixed(1)),
    stock: stock,
    inStock: stock > 0,
    customerId: customerId,
    customer: {
      city: aggregationCities[Math.floor(Math.random() * aggregationCities.length)],
      age: Math.floor(Math.random() * 43) + 18
    },
    colors: [
      aggregationColors[Math.floor(Math.random() * aggregationColors.length)],
      aggregationColors[Math.floor(Math.random() * aggregationColors.length)]
    ],
    tags: ["new", "popular"],
    specifications: {
      color: aggregationColors[Math.floor(Math.random() * aggregationColors.length)],
      warrantyYears: Math.floor(Math.random() * 3) + 1
    }
  });
}

db.aggregationProducts.insertMany(aggregationDocs);

// Supporting collection for $lookup.
let customers = [];
for (let i = 1; i <= 20; i++) {
  customers.push({
    customerId: i,
    name: "Customer " + i,
    city: aggregationCities[Math.floor(Math.random() * aggregationCities.length)]
  });
}
db.aggregationCustomers.insertMany(customers);

print("Separate aggregation collections created successfully.");

// ============================================================
// 1. $match — FILTERING
// ============================================================

// Equivalent to SQL WHERE category = 'Electronics'.
db.aggregationProducts.aggregate([
  { $match: { category: "Electronics" } }
]);

// Filter products whose price is greater than 50,000.
db.aggregationProducts.aggregate([
  { $match: { price: { $gt: 50000 } } }
]);

// ============================================================
// 2. $project — SELECT / CALCULATE FIELDS
// ============================================================

db.aggregationProducts.aggregate([
  {
    $project: {
      _id: 0,
      productName: 1,
      price: 1
    }
  }
]);

// Calculated field using $multiply.
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

// ============================================================
// 3. $group — GROUP AND CALCULATE
// ============================================================

// Distinct categories.
db.aggregationProducts.aggregate([
  { $group: { _id: "$category" } }
]);

// Count and average price by category.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalQuantity: { $sum: "$quantity" },
      averagePrice: { $avg: "$price" }
    }
  }
]);

// Minimum and maximum price.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: null,
      minimumPrice: { $min: "$price" },
      maximumPrice: { $max: "$price" }
    }
  }
]);

// Average rating.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" }
    }
  }
]);

// Demonstrate $first and $last after sorting by price.
db.aggregationProducts.aggregate([
  { $sort: { price: 1 } },
  {
    $group: {
      _id: null,
      cheapestProduct: { $first: "$productName" },
      mostExpensiveProduct: { $last: "$productName" }
    }
  }
]);

// Demonstrate $push and $addToSet.
db.aggregationProducts.aggregate([
  {
    $group: {
      _id: "$category",
      allBrands: { $push: "$brand" },
      uniqueBrands: { $addToSet: "$brand" }
    }
  }
]);

// ============================================================
// 4. $sort — SORTING
// ============================================================

db.aggregationProducts.aggregate([
  { $sort: { price: -1 } }
]);

// ============================================================
// 5. $limit — LIMIT RESULTS
// ============================================================

db.aggregationProducts.aggregate([
  { $sort: { price: -1 } },
  { $limit: 2 }
]);

// ============================================================
// 6. $skip — PAGINATION
// ============================================================

db.aggregationProducts.aggregate([
  { $skip: 2 }
]);

// $skip + $limit pagination example.
db.aggregationProducts.aggregate([
  { $sort: { productId: 1 } },
  { $skip: 10 },
  { $limit: 10 }
]);

// ============================================================
// 7. $unwind — ARRAY PROCESSING
// ============================================================

db.aggregationProducts.aggregate([
  { $unwind: "$colors" }
]);

// ============================================================
// 8. $lookup — JOIN COLLECTIONS
// ============================================================

db.aggregationProducts.aggregate([
  {
    $lookup: {
      from: "aggregationCustomers",
      localField: "customerId",
      foreignField: "customerId",
      as: "customerDetails"
    }
  }
]);

// $lookup followed by $unwind for one customer object per product.
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

// ============================================================
// 9. $count — COUNT DOCUMENTS
// ============================================================

db.aggregationProducts.aggregate([
  { $count: "totalProducts" }
]);

// ============================================================
// 10. $addFields / $set — ADD OR MODIFY FIELDS
// ============================================================

db.aggregationProducts.aggregate([
  {
    $addFields: {
      totalValue: { $multiply: ["$price", "$quantity"] }
    }
  }
]);

db.aggregationProducts.aggregate([
  {
    $set: {
      totalValue: { $multiply: ["$price", "$quantity"] }
    }
  }
]);

// ============================================================
// 11. $unset — REMOVE A FIELD FROM PIPELINE OUTPUT
// ============================================================

db.aggregationProducts.aggregate([
  { $unset: ["customer", "tags"] }
]);

// ============================================================
// 12. $replaceWith — REPLACE THE CURRENT DOCUMENT
// ============================================================

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

// ============================================================
// 13. $sample — RANDOM DOCUMENTS
// ============================================================

db.aggregationProducts.aggregate([
  { $sample: { size: 5 } }
]);

// ============================================================
// 14. $bucket — PRICE RANGES
// ============================================================

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

// ============================================================
// 15. $bucketAuto — AUTOMATIC PRICE BUCKETS
// ============================================================

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

// ============================================================
// 16. $out — WRITE PIPELINE RESULTS TO ANOTHER COLLECTION
// ============================================================

// This intentionally creates/replaces a derived collection.
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

// ============================================================
// 17. $merge — MERGE PIPELINE RESULTS INTO A COLLECTION
// ============================================================

// Merge category totals into a separate derived collection.
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

// ============================================================
// 18. COMPLETE MULTI-STAGE PIPELINES
// ============================================================

// Top 3 most expensive Electronics products.
db.aggregationProducts.aggregate([
  { $match: { category: "Electronics" } },
  { $sort: { price: -1 } },
  { $limit: 3 },
  {
    $project: {
      _id: 0,
      productName: 1,
      price: 1
    }
  }
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

// Electronics by brand: filter -> group -> calculate -> sort -> project.
db.aggregationProducts.aggregate([
  { $match: { category: "Electronics" } },
  {
    $group: {
      _id: "$brand",
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalStock: { $sum: "$stock" }
    }
  },
  { $sort: { averagePrice: -1 } },
  {
    $project: {
      _id: 0,
      brand: "$_id",
      totalProducts: 1,
      averagePrice: 1,
      totalStock: 1
    }
  }
]);

print("Complete aggregation practice finished on aggregationProducts.");
