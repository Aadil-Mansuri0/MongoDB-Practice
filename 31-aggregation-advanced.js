// Part 31: Advanced Aggregation Operations
// Advanced stages and expressions from the aggregation practice material.

use("PCEA24CA001");

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

// $map: transform every element of an array.
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

// $graphLookup: recursive relationship traversal.
// This uses seller.name as a simple relationship key when matching
// seller documents that have a parentSeller field.
db.aggex.aggregate([
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

// $sample: return a random sample of documents.
db.aggex.aggregate([
  {
    $sample: { size: 5 }
  }
]);

// $replaceWith: replace the current document with a selected embedded document.
db.aggex.aggregate([
  {
    $replaceWith: {
      productId: "$productId",
      productName: "$productName",
      price: "$price"
    }
  }
]);

// $out: write aggregation results to a separate collection.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $out: "aggregationCategoryRevenue"
  }
]);

// $merge: merge aggregation results into a target collection.
db.aggex.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalProducts: 1,
      totalRevenue: 1
    }
  },
  {
    $merge: {
      into: "aggregationCategorySummary",
      on: "category",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);

// Combined advanced pipeline: filter, unwind, group, sort, and limit.
db.aggex.aggregate([
  {
    $match: {
      price: { $gt: 50000 }
    }
  },
  {
    $unwind: "$tags"
  },
  {
    $group: {
      _id: "$tags",
      productCount: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalRevenue: { $sum: "$revenue" }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  },
  {
    $limit: 10
  }
]);
