// Part 26: deleteMany()

use("sample02");

// deleteMany() removes every document matching the filter
// This example targets a temporary marker field created for practice.
db.products.deleteMany({ categoryType: "Temporary" });
