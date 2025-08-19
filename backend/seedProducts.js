const mongoose = require('mongoose');
const Product = require('./models/product.model');
const { products } = require('./products');
require('dotenv').config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snapshop');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Transform products to match the schema
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.pictures && product.pictures[0] ? 
        `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}` : 
        'https://via.placeholder.com/300x300?text=Product',
      rating: {
        rate: product.rating || 0,
        count: product.stock || 0
      }
    }));

    // Insert products
    const result = await Product.insertMany(transformedProducts);
    console.log(`Successfully seeded ${result.length} products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
