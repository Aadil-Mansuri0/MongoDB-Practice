// Part 31: Advanced Aggregation Operations
// Advanced stages and expressions from the supplied aggregation practice material.

use("PCEA24CA001");

// Supporting seller hierarchy for $graphLookup.
db.aggregationSellers.drop();
db.aggregationSellers.insertMany([
  { sellerName: "National", parentSeller: null, level: 0 },
  { sellerName: "North", parentSeller: "National", level: 1 },
  { sellerName: "South", parentSeller: "National", level: 1 },
  { sellerName: "Jaipur", parentSeller: "North", level: 2 },
  { sellerName: "Delhi", parentSeller: "North", level: 2 },
  { sellerName: "Mumbai", parentSeller: "South", level: 2 },
  { sellerName: "Pune", parentSeller: "South", level: 2 }
]);

// $filter: keep only array elements matching a condition.
db.aggex.aggregate([
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

// $map: transform every array element.
db.aggex.aggregate([
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

// $reduce: combine array elements into one value.
db.aggex.aggregate([
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

// $graphLookup: recursively traverse the supporting seller hierarchy.
db.aggex.aggregate([
  {
    $set: {
      seller: {
        name: {
          $arrayElemAt: [
            ["Jaipur", "Delhi", "Mumbai", "Pune"],
            { $mod: [{ $toInt: { $substr: ["$productId", 4, 4] } }, 4] }
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

// $bucket: group prices into explicit ranges.
db.aggex.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 25000, 50000, 75000, 100000],
      default: "100000+",
      output: {
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    }
  }
]);

// $bucketAuto: automatically create price buckets.
db.aggex.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5,
      output: {
        count: { $sum: 1 },
        averagePrice: { $avg: "$price" }
      }
    }
  }
]);

// $sample: return random documents.
db.aggex.aggregate([
  { $sample: { size: 5 } }
]);

// $replaceWith: return a smaller document shape.
db.aggex.aggregate([
  {
    $replaceWith: {
      productId: "$productId",
      productName: "$productName",
      price: "$price"
    }
  }
]);

// $out: write category revenue results to a derived collection.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $out: "aggregationCategoryRevenue" }
]);

// $merge: merge category metrics into a derived collection.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $merge: {
      into: "aggregationCategorySummary",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);

// Combined advanced pipeline: match -> unwind -> group -> sort -> limit.
db.aggex.aggregate([
  { $match: { price: { $gt: 50000 } } },
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      productCount: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 10 }
]);
