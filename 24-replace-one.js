// Part 24: replaceOne()

use("sample02");

// replaceOne() replaces the complete matching document except for its _id
db.products.replaceOne(
  { productId: 6 },
  {
    productId: 6,
    productName: "Updated Product 6",
    category: "Laptop",
    brand: "Dell",
    price: 5000,
    stock: 20,
    rating: 4.5,
    inStock: true,
    tags: ["electronics", "updated"],
    seller: {
      sellerId: 1006,
      sellerName: "Updated Seller"
    },
    createdAt: new Date()
  }
);
