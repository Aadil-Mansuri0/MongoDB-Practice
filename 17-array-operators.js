// Part 11: Array Update Operators
// Demonstrates common array updates and useful array modifiers.

use("sample02");

// $push: add one value to an array.
db.products.updateOne(
  { productId: 2 },
  { $push: { tags: "sale" } }
);

// $addToSet: add a value only when it is not already present.
db.products.updateOne(
  { productId: 2 },
  { $addToSet: { tags: "featured" } }
);

// $pop with 1: remove the last array element.
db.products.updateOne(
  { productId: 3 },
  { $pop: { tags: 1 } }
);

// $pop with -1: remove the first array element.
db.products.updateOne(
  { productId: 4 },
  { $pop: { tags: -1 } }
);

// $pull: remove matching values from an array.
db.products.updateOne(
  { productId: 5 },
  { $pull: { tags: "new" } }
);

// $pullAll: remove multiple specific values from an array.
db.products.updateOne(
  { productId: 6 },
  { $pullAll: { tags: ["sale", "discount"] } }
);

// $push + $each: add multiple values in one operation.
db.products.updateOne(
  { productId: 7 },
  {
    $push: {
      tags: {
        $each: ["new", "limited-stock"]
      }
    }
  }
);

// $push + $position: insert multiple values at a specific array position.
db.products.updateOne(
  { productId: 8 },
  {
    $push: {
      tags: {
        $each: ["priority", "featured"],
        $position: 0
      }
    }
  }
);

// $push + $slice: keep only the first five array elements after the update.
db.products.updateOne(
  { productId: 9 },
  {
    $push: {
      tags: {
        $each: ["new", "sale"],
        $slice: 5
      }
    }
  }
);

// Verify the updated products.
db.products.find(
  { productId: { $in: [2, 3, 4, 5, 6, 7, 8, 9] } },
  { _id: 0, productId: 1, tags: 1 }
);
