// Part 11: Array Update Operators

use("sample02");

// $push: add a new tag to Product 2
db.products.updateOne(
  { productId: 2 },
  { $push: { tags: "sale" } }
);

// $addToSet: add a tag only if it does not already exist
db.products.updateOne(
  { productId: 2 },
  { $addToSet: { tags: "featured" } }
);

// $pop: remove the last tag from Product 3
db.products.updateOne(
  { productId: 3 },
  { $pop: { tags: 1 } }
);

// $pop: remove the first tag from Product 4
db.products.updateOne(
  { productId: 4 },
  { $pop: { tags: -1 } }
);

// $pull: remove the "new" tag from Product 5
db.products.updateOne(
  { productId: 5 },
  { $pull: { tags: "new" } }
);
