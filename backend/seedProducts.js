const mongoose = require('mongoose');
const Product = require('./models/product.model');
const config = require('./config/config');

const sampleProducts = [
  {
    name: "Elegant Brown Summer Dress",
    description: "Beautiful brown summer dress with elegant design. Perfect for warm weather and special occasions. Features a flattering silhouette and comfortable fit.",
    category: "dresses",
    price: 149.99,
    highPrice: 149.99,
    stock: 22,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960838/vybe/images/b3levgyczjrzrdcr4pxi.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown", "Beige"],
    gender: "women",
    discount: 15
  },
  {
    name: "Cement Color Evening Dress",
    description: "Stunning cement-colored evening dress perfect for formal events and parties. Features elegant design with premium fabric and sophisticated styling.",
    category: "dresses",
    price: 189.99,
    highPrice: 189.99,
    stock: 18,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743959867/vybe/images/bl8ognimfsgtxvdowvt1.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cement", "Gray"],
    gender: "women",
    discount: 20
  },
  {
    name: "Premium Cotton Men's T-Shirt",
    description: "High-quality cotton t-shirt with perfect fit for men. Available in multiple colors and sizes. Great for everyday wear and casual occasions.",
    category: "t-shirts",
    price: 39.99,
    highPrice: 39.99,
    stock: 45,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743996356/vybe/images/diczb7fx588i42ebst9j.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    gender: "men",
    discount: 0
  },
  {
    name: "Stylish Women's Top",
    description: "Trendy and fashionable women's top perfect for casual and semi-formal occasions. Features modern design with comfortable fit and versatile styling.",
    category: "tops",
    price: 69.99,
    highPrice: 69.99,
    stock: 28,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960279/vybe/images/dohooqr21q0ouqlauwd1.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink"],
    gender: "women",
    discount: 10
  },
  {
    name: "Classic Men's Pants",
    description: "Classic and comfortable men's pants perfect for everyday wear. Features durable fabric and comfortable fit suitable for both casual and semi-formal occasions.",
    category: "pants",
    price: 79.99,
    highPrice: 79.99,
    stock: 35,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743996296/vybe/images/dojlaggl6rwuqjkpqd9i.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray"],
    gender: "men",
    discount: 0
  },
  {
    name: "Fashionable Men's Casual Shirt",
    description: "Stylish casual shirt for men with modern design. Perfect for casual outings and everyday wear. Features comfortable fabric and trendy styling.",
    category: "shirts",
    price: 89.99,
    highPrice: 89.99,
    stock: 30,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743952549/vybe/images/fnoluqeu2jdkzcnlahnk.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "White", "Gray"],
    gender: "men",
    discount: 5
  },
  {
    name: "Beautiful Women's Party Dress",
    description: "Gorgeous party dress perfect for special occasions and celebrations. Features elegant design with premium fabric and flattering silhouette.",
    category: "dresses",
    price: 199.99,
    highPrice: 199.99,
    stock: 20,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960919/vybe/images/hhmt6rb48boeudzlswop.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Red", "Black", "Blue"],
    gender: "women",
    discount: 25
  },
  {
    name: "Elegant Women's Top",
    description: "Stylish and elegant women's top perfect for casual and semi-formal occasions. Features modern design with comfortable fit and versatile styling.",
    category: "tops",
    price: 74.99,
    highPrice: 74.99,
    stock: 25,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743959559/vybe/images/gt985edjupszmeevjdk7.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Blue"],
    gender: "women",
    discount: 12
  },
  {
    name: "Men's Formal Shirt & Pant Set",
    description: "Professional men's formal shirt and pant combination perfect for office wear and formal occasions. Features premium fabric and comfortable fit.",
    category: "formal-wear",
    price: 159.99,
    highPrice: 159.99,
    stock: 18,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743954285/vybe/images/iy2rqzm5hjh4a5lrlt2i.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Gray", "Black"],
    gender: "men",
    discount: 18
  },
  {
    name: "Elegant Women's Evening Dress",
    description: "Stunning evening dress perfect for special occasions and formal events. Features elegant design with premium fabric and sophisticated styling.",
    category: "dresses",
    price: 179.99,
    highPrice: 179.99,
    stock: 16,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960607/vybe/images/jqwwg6l3kcvgzjczrdzn.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Red", "Blue", "Purple"],
    gender: "women",
    discount: 22
  },
  {
    name: "Men's Casual Shirt & Pant Combo",
    description: "Comfortable casual shirt and pant combination perfect for everyday wear and casual outings. Features durable fabric and relaxed fit.",
    category: "casual-wear",
    price: 119.99,
    highPrice: 119.99,
    stock: 24,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743955696/vybe/images/kxuuls2qsszpgmfx9zp7.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Gray", "White", "Black"],
    gender: "men",
    discount: 8
  },
  {
    name: "Trendy Women's Top",
    description: "Fashionable and trendy women's top perfect for casual and semi-formal occasions. Features modern design with comfortable fit and versatile styling.",
    category: "tops",
    price: 64.99,
    highPrice: 64.99,
    stock: 30,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960749/vybe/images/lh2fk2c7u9vrnuplz74t.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Pink", "Yellow"],
    gender: "women",
    discount: 15
  },
  {
    name: "Classic Men's Formal Shirt",
    description: "Timeless formal shirt perfect for office wear and business meetings. Features premium cotton fabric and professional styling.",
    category: "shirts",
    price: 94.99,
    highPrice: 94.99,
    stock: 28,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743953499/vybe/images/oqfx0dutl0uwt2asttja.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Pink", "Gray"],
    gender: "men",
    discount: 5
  },
  {
    name: "Beautiful Women's Summer Dress",
    description: "Gorgeous summer dress perfect for warm weather and casual occasions. Features light fabric and comfortable fit with elegant design.",
    category: "dresses",
    price: 139.99,
    highPrice: 139.99,
    stock: 22,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743960753/vybe/images/rseu4zhe2wlvl6xjiu6x.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue", "Green", "Yellow", "Pink"],
    gender: "women",
    discount: 20
  },
  {
    name: "Men's Casual Shorts",
    description: "Comfortable and stylish men's casual shorts perfect for summer wear and casual outings. Features breathable fabric and relaxed fit.",
    category: "shorts",
    price: 54.99,
    highPrice: 54.99,
    stock: 35,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743952134/vybe/images/x3wdzmemfqvgpyrhslaw.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Blue", "Khaki"],
    gender: "men",
    discount: 10
  },
  {
    name: "Men's Athletic Shorts",
    description: "High-quality athletic shorts perfect for sports and workout activities. Features moisture-wicking fabric and comfortable elastic waistband.",
    category: "shorts",
    price: 69.99,
    highPrice: 69.99,
    stock: 28,
    image: "https://res.cloudinary.com/ds9ufpxom/image/upload/v1743996153/vybe/images/zlzrcdrttkpvg0bsydzk.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Blue", "Red"],
    gender: "men",
    discount: 15
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
