// ============================================================
// MongoDB Indexes Practical
// Database: PCEA24CA001
// Collection: indexProducts
// ============================================================
// This practical uses a separate collection so the existing
// MongoDB practice collections are not modified.
//
// Topics covered:
// 1. Simple Index
// 2. Compound Index
// 3. Multikey Index
// 4. Text Index
// 5. Hashed Index
// 6. Geospatial (2dsphere) Index
// 7. Unique + Sparse Index
// 8. Partial Index
// 9. Wildcard Index
// 10. explain("executionStats") and getIndexes()
// ============================================================

use("PCEA24CA001");

const collectionName = "indexProducts";
const productsCollection = db.getCollection(collectionName);

// ------------------------------------------------------------
// 0. Create a separate collection and generate 5000 documents
// ------------------------------------------------------------
// Drop only this practice collection if it already exists.
// This does NOT affect other collections in PCEA24CA001.
if (db.getCollectionNames().includes(collectionName)) {
    productsCollection.drop();
}

const categories = [
    "Electronics",
    "Mobiles",
    "Laptops",
    "Clothing",
    "Books",
    "Furniture",
    "Shoes",
    "Accessories",
    "Home Appliances",
    "Sports"
];

const brands = [
    "Apple",
    "Samsung",
    "Dell",
    "HP",
    "Lenovo",
    "Sony",
    "Nike",
    "Adidas",
    "Puma",
    "OnePlus"
];

const cities = [
    "Chennai",
    "Bangalore",
    "Hyderabad",
    "Coimbatore",
    "Salem",
    "Erode",
    "Tiruchengode",
    "Madurai",
    "Trichy",
    "Pondicherry"
];

const tags = [
    "new",
    "popular",
    "discount",
    "premium",
    "bestseller",
    "trending",
    "featured",
    "budget"
];

const paymentMethods = [
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash",
    "Net Banking"
];

let products = [];

for (let i = 1; i <= 5000; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const city = cities[i % cities.length];
    const price = Math.floor(Math.random() * 90000) + 1000;
    const quantity = Math.floor(Math.random() * 10) + 1;
    const rating = Number((Math.random() * 4 + 1).toFixed(1));

    const productTags = [
        tags[i % tags.length],
        tags[(i + 2) % tags.length]
    ];

    const product = {
        productId: i,
        name: brand + " Product " + i,
        category: category,
        brand: brand,
        price: price,
        quantity: quantity,
        rating: rating,
        description:
            "This is a high quality " +
            category +
            " product from " +
            brand +
            " with excellent features and performance.",
        tags: productTags,
        seller: {
            sellerId: 1000 + (i % 100),
            name: "Seller " + (i % 100),
            city: city
        },
        location: {
            type: "Point",
            coordinates: [
                76.95 + Math.random() * 0.5,
                11.00 + Math.random() * 0.5
            ]
        },
        paymentMethods: paymentMethods,
        isActive: i % 5 !== 0,
        createdAt: new Date(2024, i % 12, (i % 28) + 1)
    };

    // Present in only some documents -> useful for Sparse Index.
    if (i % 3 === 0) {
        product.email = "customer" + i + "@example.com";
    }

    // Present in only some documents -> useful for Partial Index.
    if (i % 4 === 0) {
        product.discount = Math.floor(Math.random() * 40) + 5;
    }

    products.push(product);

    if (products.length === 500) {
        productsCollection.insertMany(products);
        products = [];
    }
}

if (products.length > 0) {
    productsCollection.insertMany(products);
}

print("5000 documents inserted into " + collectionName + " successfully!");
print("Document count: " + productsCollection.countDocuments());

// ============================================================
// 1. SIMPLE INDEX
// ============================================================
// Simple Index = index on ONE field.
//
// First check the query without a price index.
print("\n--- 1A. Before Simple Index ---");
printjson(
    productsCollection.find({ price: { $gt: 50000 } }).explain("executionStats")
);

// Create ascending index on price.
productsCollection.createIndex({ price: 1 }, { name: "idx_price" });

print("\n--- 1B. After Simple Index ---");
printjson(
    productsCollection.find({ price: { $gt: 50000 } }).explain("executionStats")
);

// Check all indexes.
print("\n--- Current Indexes ---");
printjson(productsCollection.getIndexes());

// To remove the simple index later:
// productsCollection.dropIndex("idx_price");

// ============================================================
// 2. COMPOUND INDEX
// ============================================================
// Compound Index = index on TWO or MORE fields.
// 1 = ascending, -1 = descending.

print("\n--- 2A. Compound Index Query Before Compound Index ---");
printjson(
    productsCollection.find({
        category: "Electronics",
        price: { $gt: 50000 }
    }).explain("executionStats")
);

productsCollection.createIndex(
    { category: 1, price: -1 },
    { name: "idx_category_price" }
);

print("\n--- 2B. Compound Index Query After Compound Index ---");
printjson(
    productsCollection.find({
        category: "Electronics",
        price: { $gt: 50000 }
    }).explain("executionStats")
);

// ============================================================
// 3. MULTIKEY INDEX
// ============================================================
// A Multikey Index is created when the indexed field contains
// an array. MongoDB creates index entries for array elements.

productsCollection.createIndex(
    { tags: 1 },
    { name: "idx_tags_multikey" }
);

print("\n--- 3. Multikey Index ---");
printjson(
    productsCollection.find({ tags: "bestseller" }).explain("executionStats")
);

// ============================================================
// 4. TEXT INDEX
// ============================================================
// Text Index supports word-based searching inside string fields.

productsCollection.createIndex(
    { description: "text" },
    { name: "idx_description_text" }
);

print("\n--- 4. Text Index ---");
printjson(
    productsCollection.find({
        $text: { $search: "Samsung" }
    }).explain("executionStats")
);

// Example text query:
// productsCollection.find({ $text: { $search: "high quality Samsung" } });

// ============================================================
// 5. HASHED INDEX
// ============================================================
// A Hashed Index stores a hash of the indexed value.
// It is mainly useful for equality queries and shard-key patterns.

productsCollection.createIndex(
    { productId: "hashed" },
    { name: "idx_productId_hashed" }
);

print("\n--- 5. Hashed Index ---");
printjson(productsCollection.getIndexes());
printjson(
    productsCollection.find({ productId: 101 }).explain("executionStats")
);

// ============================================================
// 6. GEOSPATIAL INDEX (2dsphere)
// ============================================================
// location follows GeoJSON Point format:
// coordinates = [longitude, latitude]

productsCollection.createIndex(
    { location: "2dsphere" },
    { name: "idx_location_2dsphere" }
);

print("\n--- 6. Geospatial Index ---");
printjson(
    productsCollection.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [77.0, 11.1]
                },
                $maxDistance: 10000
            }
        }
    }).limit(10).explain("executionStats")
);

// ============================================================
// 7. UNIQUE + SPARSE INDEX
// ============================================================
// email exists only in documents where i % 3 === 0.
// unique=true prevents duplicate email values among indexed docs.
// sparse=true excludes documents where email is missing.

productsCollection.createIndex(
    { email: 1 },
    {
        unique: true,
        sparse: true,
        name: "idx_email_unique_sparse"
    }
);

print("\n--- 7. Unique + Sparse Index ---");
printjson(productsCollection.getIndexes());
printjson(
    productsCollection.findOne({ email: "customer3@example.com" })
);

// This would fail because customer3@example.com already exists:
// productsCollection.insertOne({
//     productId: 6001,
//     email: "customer3@example.com"
// });

// ============================================================
// 8. PARTIAL INDEX
// ============================================================
// Only documents having a discount field are indexed.
// This is useful when a field is relevant only for a subset of docs.

productsCollection.createIndex(
    { discount: 1 },
    {
        partialFilterExpression: { discount: { $exists: true } },
        name: "idx_discount_partial"
    }
);

print("\n--- 8. Partial Index ---");
printjson(
    productsCollection.find({
        discount: { $gte: 20 }
    }).explain("executionStats")
);

// ============================================================
// 9. WILDCARD INDEX
// ============================================================
// Wildcard Index indexes arbitrary fields, useful for documents
// with dynamic or highly variable structures.

productsCollection.createIndex(
    { "$**": 1 },
    { name: "idx_wildcard_all_fields" }
);

print("\n--- 9. Wildcard Index ---");
printjson(productsCollection.getIndexes());

// Example query that can benefit from wildcard indexing:
// productsCollection.find({ seller: { $exists: true } });

// ============================================================
// 10. FINAL INDEX LIST
// ============================================================
print("\n--- 10. Final Index List ---");
printjson(productsCollection.getIndexes());

print("\nIndex practical completed successfully on database PCEA24CA001.");
print("Practice collection used: " + collectionName);

// ------------------------------------------------------------
// OPTIONAL: Drop individual indexes if you want to practice.
// Uncomment one command at a time.
// ------------------------------------------------------------
// productsCollection.dropIndex("idx_price");
// productsCollection.dropIndex("idx_category_price");
// productsCollection.dropIndex("idx_tags_multikey");
// productsCollection.dropIndex("idx_description_text");
// productsCollection.dropIndex("idx_productId_hashed");
// productsCollection.dropIndex("idx_location_2dsphere");
// productsCollection.dropIndex("idx_email_unique_sparse");
// productsCollection.dropIndex("idx_discount_partial");
// productsCollection.dropIndex("idx_wildcard_all_fields");
