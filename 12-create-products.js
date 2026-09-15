// Part 06: Create Products Collection and Insert 50 Products

use("sample02");

db.createCollection("products");

for (let i = 1; i <= 50; i++) {
  db.products.insertOne({
    productId: i,
    productName: "Product " + i,
    category:
      i % 5 === 0 ? "Mouse" :
      i % 5 === 4 ? "Keyboard" :
      i % 5 === 3 ? "Headphones" :
      i % 5 === 2 ? "Mobile" : "Laptop",
    brand:
      i % 3 === 0 ? "HP" :
      i % 3 === 2 ? "Samsung" : "Dell",
    price: 1000 + (i * 500),
    stock: 10 + i,
    rating: 3 + ((i % 3) * 0.5),
    inStock: i % 4 !== 0,
    tags: i % 2 === 0 ? ["electronics", "featured"] : ["electronics", "new"],
    seller: {
      sellerId: 1000 + i,
      sellerName: "Seller " + i
    },
    createdAt: new Date()
  });
}
