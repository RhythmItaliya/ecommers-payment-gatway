const mongoose = require('mongoose');
const Product = require('./models/product.model');
const config = require('./config/config');

// Sample real products data
const sampleProducts = [
  {
    name: "Classic Denim Jacket",
    description: "Timeless denim jacket perfect for any casual occasion. Features classic styling with comfortable fit.",
    category: "jackets",
    price: 89.99,
    higePrice: 89.99,
    stock: 25,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    gender: "men",
    discount: 20
  },
  {
    name: "Elegant Summer Dress",
    description: "Beautiful summer dress with floral pattern. Perfect for warm weather and special occasions.",
    category: "dresses",
    price: 129.99,
    higePrice: 129.99,
    stock: 18,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pink"],
    gender: "women",
    discount: 15
  },
  {
    name: "Premium Cotton T-Shirt",
    description: "High-quality cotton t-shirt with perfect fit. Available in multiple colors and sizes.",
    category: "t-shirts",
    price: 29.99,
    higePrice: 29.99,
    stock: 50,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    gender: "men",
    discount: 0
  },
  {
    name: "Stylish Hoodie",
    description: "Comfortable and trendy hoodie perfect for casual wear. Made from soft, warm material.",
    category: "hoodies",
    price: 79.99,
    higePrice: 79.99,
    stock: 30,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black", "Blue"],
    gender: "unisex",
    discount: 0
  },
  {
    name: "Casual Jeans",
    description: "Classic blue jeans with perfect fit. Great for everyday wear and casual occasions.",
    category: "jeans",
    price: 69.99,
    higePrice: 69.99,
    stock: 40,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    gender: "unisex",
    discount: 0
  }
];

// Connect to MongoDB and seed products
const seedProducts = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${result.length} products`);

    // Display seeded products
            console.log('\nSeeded Products:');
        result.forEach(product => {
          console.log(`- ${product.name} (₹${product.price}) - ${product.category} - ${product.gender} - Stock: ${product.stock}`);
        });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
