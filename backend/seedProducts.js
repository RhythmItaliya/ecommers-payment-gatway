const mongoose = require('mongoose');
const Product = require('./models/product.model');
const config = require('./config/config');

// Sample real products data
const sampleProducts = [
  {
    id: 1,
    title: "Classic Denim Jacket",
    name: "Classic Denim Jacket",
    price: 89.99,
    discount: 20,
    salePrice: 71.99,
    description: "Timeless denim jacket perfect for any casual occasion. Features classic styling with comfortable fit.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
    pictures: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500"
    ],
    stock: 25,
    rating: {
      rate: 4.5,
      count: 128
    },
    tags: ["Men", "Jacket", "Denim", "Casual"],
    size: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"]
  },
  {
    id: 2,
    title: "Elegant Summer Dress",
    name: "Elegant Summer Dress",
    price: 129.99,
    discount: 15,
    salePrice: 110.49,
    description: "Beautiful summer dress with floral pattern. Perfect for warm weather and special occasions.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
    pictures: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
    ],
    stock: 18,
    rating: {
      rate: 4.8,
      count: 95
    },
    tags: ["Women", "Dress", "Summer", "Floral"],
    size: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pink"]
  },
  {
    id: 3,
    title: "Premium Cotton T-Shirt",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    discount: 0,
    salePrice: 29.99,
    description: "High-quality cotton t-shirt with perfect fit. Available in multiple colors and sizes.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    pictures: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    ],
    stock: 50,
    rating: {
      rate: 4.3,
      count: 203
    },
    tags: ["Men", "T-Shirt", "Cotton", "Basic"],
    size: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"]
  },
  {
    id: 4,
    title: "Stylish Handbag",
    name: "Stylish Handbag",
    price: 79.99,
    discount: 25,
    salePrice: 59.99,
    description: "Elegant handbag with multiple compartments. Perfect for everyday use and professional settings.",
    category: "women's clothing",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    pictures: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    stock: 12,
    rating: {
      rate: 4.6,
      count: 67
    },
    tags: ["Women", "Bag", "Handbag", "Professional"],
    size: ["One Size"],
    colors: ["Brown", "Black", "Tan"]
  },
  {
    id: 5,
    title: "Casual Sneakers",
    name: "Casual Sneakers",
    price: 69.99,
    discount: 10,
    salePrice: 62.99,
    description: "Comfortable and stylish sneakers for everyday wear. Great for casual outings and light activities.",
    category: "men's clothing",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    pictures: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
    ],
    stock: 35,
    rating: {
      rate: 4.4,
      count: 156
    },
    tags: ["Men", "Shoes", "Sneakers", "Casual"],
    size: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Gray", "Blue"]
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
      console.log(`- ${product.title} ($${product.price}) - ${product.category}`);
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
