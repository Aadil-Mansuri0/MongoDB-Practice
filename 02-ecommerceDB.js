// MongoDB Practice 02 - E-Commerce Database

use ecommerceDB

db.createCollection("products")

db.products.insertMany([
  {
    product_id: 201,
    product_name: "Laptop",
    price: 65000,
    category: "Electronics",
    tags: ["computer", "work", "student"],
    seller: { name: "Tech Store", city: "Jaipur" }
  },
  {
    product_id: 202,
    product_name: "Smartphone",
    price: 30000,
    category: "Electronics",
    tags: ["mobile", "android", "5G"],
    seller: { name: "Mobile Hub", city: "Delhi" }
  },
  {
    product_id: 203,
    product_name: "Headphones",
    price: 2500,
    category: "Accessories",
    tags: ["audio", "wireless"],
    seller: { name: "Audio World", city: "Mumbai" }
  },
  {
    product_id: 204,
    product_name: "Keyboard",
    price: 1800,
    category: "Accessories",
    tags: ["computer", "mechanical"],
    seller: { name: "Tech Store", city: "Jaipur" }
  }
])

db.products.find().pretty()
