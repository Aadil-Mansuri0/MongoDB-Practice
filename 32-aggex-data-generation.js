// Part 32: aggex Data Generation
// Generates the same 5000-document aggex dataset used in mongosh practice.
// Run this once for a fresh practice dataset.

use("PCEA24CA001");

// Start fresh so repeated execution does not create duplicate datasets.
db.aggex.drop();

const categories = [
  "Electronics", "Mobiles", "Laptops", "Home Appliances", "Fashion",
  "Books", "Sports", "Beauty", "Grocery", "Furniture"
];

const subCategories = {
  "Electronics": ["Headphones", "Smartwatch", "Camera", "Speaker"],
  "Mobiles": ["Android", "iPhone", "Feature Phone"],
  "Laptops": ["Gaming", "Business", "Student"],
  "Home Appliances": ["Refrigerator", "Washing Machine", "Microwave"],
  "Fashion": ["Men", "Women", "Kids"],
  "Books": ["Programming", "Fiction", "Education"],
  "Sports": ["Cricket", "Football", "Fitness"],
  "Beauty": ["Skincare", "Haircare", "Makeup"],
  "Grocery": ["Snacks", "Beverages", "Staples"],
  "Furniture": ["Chair", "Table", "Sofa"]
};

const brands = [
  "Samsung", "Apple", "Sony", "LG", "HP", "Dell",
  "Lenovo", "Nike", "Adidas", "Boat", "OnePlus", "AmazonBasics"
];

const cities = [
  "Chennai", "Coimbatore", "Bangalore", "Hyderabad", "Mumbai",
  "Delhi", "Pune", "Kochi", "Kolkata", "Ahmedabad"
];

const states = [
  "Tamil Nadu", "Karnataka", "Telangana", "Maharashtra",
  "Delhi", "Kerala", "West Bengal", "Gujarat"
];

const paymentMethods = [
  "UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"
];

const orderStatuses = [
  "Delivered", "Shipped", "Processing", "Cancelled", "Returned"
];

const sellers = [
  "RetailHub", "TechWorld", "MegaStore", "DigitalMart", "SmartShop", "PrimeRetail"
];

const tags = [
  "new", "popular", "trending", "premium", "budget", "best-seller", "discount", "limited-stock"
];

let documents = [];

for (let i = 1; i <= 5000; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const subCategory = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
  const seller = sellers[Math.floor(Math.random() * sellers.length)];

  const quantity = Math.floor(Math.random() * 5) + 1;
  const price = Math.floor(Math.random() * 95000) + 500;
  const discount = Math.floor(Math.random() * 51);
  const discountedPrice = Math.round(price - (price * discount / 100));
  const rating = Number((Math.random() * 4 + 1).toFixed(1));
  const stock = Math.floor(Math.random() * 500);

  const selectedTags = [];
  for (let j = 0; j < 2; j++) {
    selectedTags.push(tags[Math.floor(Math.random() * tags.length)]);
  }

  const startDate = new Date("2024-01-01").getTime();
  const endDate = new Date("2026-08-25").getTime();
  const randomDate = new Date(startDate + Math.random() * (endDate - startDate));

  documents.push({
    productId: "PROD" + String(i).padStart(5, "0"),
    productName: brand + " " + subCategory + " " + i,
    category,
    subCategory,
    brand,
    price,
    discountPercentage: discount,
    discountedPrice,
    quantity,
    revenue: discountedPrice * quantity,
    rating,
    reviewCount: Math.floor(Math.random() * 5000),
    stock,
    inStock: stock > 0,
    seller: {
      name: seller,
      sellerRating: Number((Math.random() * 4 + 1).toFixed(1))
    },
    customer: {
      customerId: "CUS" + String(Math.floor(Math.random() * 1000) + 1).padStart(4, "0"),
      city,
      state,
      age: Math.floor(Math.random() * 50) + 18
    },
    payment: {
      method: paymentMethod,
      transactionId: "TXN" + Math.random().toString(36).substring(2, 12)
    },
    orderStatus,
    orderDate: randomDate,
    tags: selectedTags,
    specifications: {
      warranty: (Math.floor(Math.random() * 3) + 1) + " years",
      color: ["Black", "White", "Blue", "Red", "Silver"][Math.floor(Math.random() * 5)],
      weight: Number((Math.random() * 5 + 0.5).toFixed(2))
    },
    isFeatured: Math.random() > 0.7,
    createdAt: new Date()
  });

  if (documents.length === 500) {
    db.aggex.insertMany(documents);
    documents = [];
  }
}

if (documents.length > 0) {
  db.aggex.insertMany(documents);
}

print("5000 documents inserted successfully into aggex!");
print("Total documents:", db.aggex.countDocuments());
