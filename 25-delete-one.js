// Part 25: deleteOne()

use("sample02");

// deleteOne() removes the first document matching the filter
db.products.deleteOne({ productId: 7 });
