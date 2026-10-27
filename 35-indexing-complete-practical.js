// ============================================================
// MongoDB Indexing: Complete Practical
// Database: PCEA24CA001
// Collection: indexingLabProducts
// Run with: load("35-indexing-complete-practical.js")
// ============================================================
// Covers:
// 1. Index basics and creation
// 2. Single-field index
// 3. Compound index and field order (ESR guideline)
// 4. Multikey index
// 5. explain("executionStats") and index validation
// 6. Hidden indexes
// 7. Unique index and duplicate-key error handling
// 8. Common index inspection commands
// 9. Safe index removal
//
// SAFETY: This script drops/recreates ONLY indexingLabProducts.
// It does not intentionally modify other collections.
// ============================================================

use("PCEA24CA001");

const collectionName = "indexingLabProducts";

// Recreate only this dedicated practice collection so the script
// can be run repeatedly with predictable sample data.
if (db.getCollectionNames().includes(collectionName)) {
    db.getCollection(collectionName).drop();
}

const products = db.getCollection(collectionName);

print("\n=== 1. INSERT SAMPLE E-COMMERCE DATA ===");

products.insertMany([
    { productId: 101, name: "MacBook Air M2", category: "Electronics", brand: "Apple", price: 85000, stock: 12, tags: ["laptop", "computer", "apple"], isActive: true },
    { productId: 102, name: "iPhone 16", category: "Electronics", brand: "Apple", price: 70000, stock: 20, tags: ["mobile", "smartphone", "apple"], isActive: true },
    { productId: 103, name: "Galaxy S25", category: "Electronics", brand: "Samsung", price: 80000, stock: 15, tags: ["mobile", "android", "samsung"], isActive: true },
    { productId: 104, name: "Running Shoes", category: "Fashion", brand: "Nike", price: 4500, stock: 30, tags: ["shoes", "running", "sports"], isActive: true },
    { productId: 105, name: "Wireless Mouse", category: "Accessories", brand: "Logitech", price: 1500, stock: 50, tags: ["mouse", "computer", "wireless"], isActive: true },
    { productId: 106, name: "Inspiron Laptop", category: "Electronics", brand: "Dell", price: 65000, stock: 8, tags: ["laptop", "computer", "dell"], isActive: false },
    { productId: 107, name: "Mechanical Keyboard", category: "Accessories", brand: "Logitech", price: 5500, stock: 25, tags: ["keyboard", "computer", "wireless"], isActive: true },
    { productId: 108, name: "AirPods", category: "Electronics", brand: "Apple", price: 18000, stock: 18, tags: ["audio", "wireless", "apple"], isActive: true }
]);

print("Documents inserted: " + products.countDocuments());
printjson(products.find({}, { _id: 0, productId: 1, name: 1, category: 1, price: 1 }).toArray());

// ============================================================
// 1B. DOCUMENT VALIDATION (SCHEMA VALIDATION)
// ============================================================
// Schema validation checks the shape and data types of documents.
// It is separate from an index: indexes improve query access, while
// validation helps prevent invalid documents from being stored.
db.runCommand({
    collMod: collectionName,
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["productId", "name", "category", "price", "tags"],
            properties: {
                productId: { bsonType: ["int", "long", "double"] },
                name: { bsonType: "string" },
                category: { bsonType: "string" },
                price: { bsonType: ["int", "long", "double", "decimal"], minimum: 0 },
                tags: { bsonType: "array", items: { bsonType: "string" } }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});

print("\\n=== 1B. EXPECTED SCHEMA VALIDATION ERROR ===");
try {
    products.insertOne({
        productId: 999,
        name: "Invalid Price Test",
        category: "Testing",
        price: "not-a-number",
        tags: ["test"]
    });
    print("Unexpected: invalid document was inserted.");
} catch (error) {
    print("Expected validation error caught: " + error.message);
}

// ============================================================
// 2. SINGLE-FIELD INDEX
// ============================================================
// A single-field index is created on one field.
// 1 = ascending order; -1 = descending order.

print("\n=== 2A. QUERY PLAN BEFORE INDEX ===");
printjson(
    products.find({ price: { $gte: 50000 } }).explain("executionStats")
);

products.createIndex({ price: 1 }, { name: "idx_price_asc" });

print("\n=== 2B. QUERY PLAN AFTER INDEX ===");
printjson(
    products.find({ price: { $gte: 50000 } }).explain("executionStats")
);

// ============================================================
// 3. COMPOUND INDEX + FIELD ORDER
// ============================================================
// Compound index: more than one field in a single index.
// This order supports category equality, followed by price range
// and can support price sorting in the matching direction.

products.createIndex(
    { category: 1, price: 1 },
    { name: "idx_category_price" }
);

print("\n=== 3A. COMPOUND INDEX QUERY ===");
printjson(
    products.find({
        category: "Electronics",
        price: { $gte: 50000 }
    }).sort({ price: 1 }).explain("executionStats")
);

// ESR guideline: Equality, Sort, Range is a useful starting point.
// Example: equality on category, sort by price, then range on stock.
products.createIndex(
    { category: 1, price: -1, stock: 1 },
    { name: "idx_category_sort_price_range_stock" }
);

print("\n=== 3B. ESR-STYLE QUERY ===");
printjson(
    products.find({
        category: "Electronics",
        stock: { $gte: 10 }
    }).sort({ price: -1 }).explain("executionStats")
);

// Index order matters. An index beginning with category is usually
// more useful for category-only queries than one beginning with price.
// Choose the order based on actual query patterns and test with explain().

// ============================================================
// 4. MULTIKEY INDEX
// ============================================================
// Indexing an array field creates a multikey index automatically.

products.createIndex({ tags: 1 }, { name: "idx_tags_multikey" });

print("\n=== 4. MULTIKEY INDEX QUERY ===");
printjson(
    products.find({ tags: "laptop" }).explain("executionStats")
);

// ============================================================
// 5. EXPLAIN PLAN + INDEX VALIDATION
// ============================================================
// IXSCAN means an index scan was selected.
// COLLSCAN means MongoDB scanned the collection.
// Check winningPlan, nReturned, totalKeysExamined and
// totalDocsExamined. A small collection may still use COLLSCAN.

print("\n=== 5. EXPLAIN EXECUTION STATS ===");
printjson(
    products.find({ productId: 101 }).explain("executionStats")
);

print("\n=== 5B. LIST ALL INDEXES ===");
printjson(products.getIndexes());

// hint() is useful for controlled testing of a named index.
// Do not force indexes in production without measuring the workload.
print("\n=== 5C. TEST A SPECIFIC INDEX WITH HINT ===");
printjson(
    products.find({ price: { $gte: 50000 } })
        .hint("idx_price_asc")
        .explain("executionStats")
);

// ============================================================
// 6. HIDDEN INDEX
// ============================================================
// A hidden index is retained on disk but ignored by normal query
// planning. Hide/unhide can help test the effect before dropping it.

print("\n=== 6A. HIDE PRICE INDEX ===");
products.hideIndex("idx_price_asc");
printjson(products.getIndexes());

print("\n=== 6B. QUERY PLAN WHILE INDEX IS HIDDEN ===");
printjson(
    products.find({ price: { $gte: 50000 } }).explain("executionStats")
);

print("\n=== 6C. UNHIDE PRICE INDEX ===");
products.unhideIndex("idx_price_asc");
printjson(products.getIndexes());

// ============================================================
// 7. UNIQUE INDEX + ERROR HANDLING
// ============================================================
// A unique index prevents duplicate productId values.
// Existing duplicate values must be resolved before creating it.

products.createIndex(
    { productId: 1 },
    { unique: true, name: "idx_productId_unique" }
);

print("\n=== 7A. UNIQUE INDEX VALIDATION ===");
printjson(products.getIndexes());

print("\n=== 7B. EXPECTED DUPLICATE-KEY ERROR ===");
try {
    products.insertOne({
        productId: 101,
        name: "Duplicate Test Product",
        category: "Testing",
        price: 999
    });
    print("Unexpected: duplicate productId was inserted.");
} catch (error) {
    print("Expected index error caught: " + error.message);
}

// Other common index creation issues:
// - Duplicate values when creating a unique index
// - Conflicting index options or an index-name conflict
// - Insufficient disk space/resources during a large index build
// Check existing indexes with getIndexes() and read the full error.

// ============================================================
// 8. INDEX ORDER COMPARISON / PRACTICAL VALIDATION
// ============================================================
// Compare candidate indexes with the queries used by your app.
// Do not assume IXSCAN is always faster; inspect documents/keys
// examined, returned results, sorting and real workload timings.

print("\n=== 8. FINAL QUERY PLAN FOR COMPOUND INDEX ===");
printjson(
    products.find({ category: "Electronics" })
        .sort({ price: 1 })
        .explain("executionStats")
);

// ============================================================
// 9. CLEANUP (OPTIONAL)
// ============================================================
// Drop one index by its name; documents remain untouched.
// Uncomment only if you want to practise removing an index.
// products.dropIndex("idx_tags_multikey");
//
// To inspect indexes again:
// printjson(products.getIndexes());
//
// To remove the entire practice collection and its indexes, run:
// db.getCollection("indexingLabProducts").drop();
// ============================================================

print("\nIndexing practical completed.");
print("Database: PCEA24CA001");
print("Collection: " + collectionName);
print("Documents: " + products.countDocuments());
print("Review explain() output; exact plans and timings can vary.");
