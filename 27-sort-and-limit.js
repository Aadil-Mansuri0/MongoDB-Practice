// Part 27: Sorting and Limiting

use("sample02");

// Sort products by price in ascending order
db.products.find().sort({ price: 1 });

// Sort products by price in descending order
db.products.find().sort({ price: -1 });

// Return only the first 5 products after sorting by price
db.products.find().sort({ price: -1 }).limit(5);
