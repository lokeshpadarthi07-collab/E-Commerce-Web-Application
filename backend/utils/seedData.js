const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' });

const seedProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    description: 'Industry-leading active noise cancelling headphones with Auto NC Optimizer, 30-hour battery life, and crystal-clear hands-free calling.',
    price: 29990,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 342 },
    stock: 25,
    isFeatured: true,
    isPopular: true,
    brand: 'Sony'
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Powered by S9 SiP with Double Tap gesture control, brighter Always-On Retina display, advanced health tracking & ECG.',
    price: 41900,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 512 },
    stock: 18,
    isFeatured: true,
    isPopular: true,
    brand: 'Apple'
  },
  {
    name: "Nike Air Force 1 '07 Leather Sneakers",
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on crisp leather and classic white cushioning.",
    price: 8995,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 820 },
    stock: 30,
    isFeatured: true,
    isPopular: true,
    brand: 'Nike'
  },
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    description: 'Quiet clicks and 8K DPI glass-surface tracking. Electromagnetic MagSpeed scrolling wheel for maximum productivity.',
    price: 9995,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 188 },
    stock: 20,
    isFeatured: true,
    isPopular: true,
    brand: 'Logitech'
  },
  {
    name: 'Bose SoundLink Flex Portable Bluetooth Speaker',
    description: 'Deep, immersive sound engineered with PositionIQ technology that automatically optimizes orientation whether flat or upright.',
    price: 15900,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 215 },
    stock: 15,
    isFeatured: true,
    isPopular: false,
    brand: 'Bose'
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra AMOLED 14.6"',
    description: 'Dynamic AMOLED 2X display with S Pen included, Snapdragon 8 Gen 2 processor, armor aluminum frame, and IP68 rating.',
    price: 108999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 96 },
    stock: 10,
    isFeatured: true,
    isPopular: true,
    brand: 'Samsung'
  },
  {
    name: 'Ray-Ban Classic Wayfarer Polarized Sunglasses',
    description: 'The iconic Wayfarer shape crafted with high-grade acetate frames, anti-glare G-15 polarized green lenses, and 100% UV protection.',
    price: 9890,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.6, count: 142 },
    stock: 22,
    isFeatured: false,
    isPopular: true,
    brand: 'Ray-Ban'
  },
  {
    name: 'Razer BlackWidow V4 Pro Mechanical Gaming Keyboard',
    description: 'Full-blown battlestation keyboard featuring Razer Command Dial, dedicated macro keys, magnetic plush wrist rest, and Chroma RGB.',
    price: 21999,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 110 },
    stock: 12,
    isFeatured: false,
    isPopular: true,
    brand: 'Razer'
  },
  {
    name: 'Dyson Pure Cool Link Air Purifier & Tower Fan',
    description: 'Automatically senses and removes 99.95% of ultrafine particles, allergens, and gaseous pollutants with 360 Glass HEPA filter.',
    price: 39900,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 165 },
    stock: 14,
    isFeatured: true,
    isPopular: true,
    brand: 'Dyson'
  },
  {
    name: 'JBL Tour Pro 2 TWS Earbuds with Smart Case',
    description: "World's first smart charging case with touch screen control. True adaptive noise cancelling with 6-mic crystal voice calls.",
    price: 18999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 178 },
    stock: 28,
    isFeatured: false,
    isPopular: true,
    brand: 'JBL'
  },
  {
    name: 'Apple MacBook Air M3 15-inch Liquid Retina',
    description: 'Strikingly thin design with M3 chip speed, up to 18 hours battery life, 1080p FaceTime HD camera, and MagSafe 3 charging.',
    price: 134900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 640 },
    stock: 15,
    isFeatured: true,
    isPopular: true,
    brand: 'Apple'
  },
  {
    name: 'Fossil Gen 6 Wellness Edition Touchscreen Watch',
    description: 'Powered by Wear OS by Google. Fast 30-min charging to 80%, SPO2 monitoring, continuous heart rate tracking, and Google Wallet.',
    price: 23995,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.5, count: 89 },
    stock: 16,
    isFeatured: false,
    isPopular: false,
    brand: 'Fossil'
  },
  {
    name: 'Sony PlayStation 5 DualSense Wireless Controller',
    description: 'Discover a deeper gaming experience with innovative haptic feedback, dynamic adaptive triggers, and built-in microphone.',
    price: 5990,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 940 },
    stock: 40,
    isFeatured: true,
    isPopular: true,
    brand: 'Sony'
  },
  {
    name: 'Puma RS-X Metallic Unisex Lifestyle Sneakers',
    description: 'Future-retro silhouette with chunky aesthetic, mesh upper with suede overlays, and lightweight polyurethane midsole for all-day comfort.',
    price: 7999,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 230 },
    stock: 22,
    isFeatured: false,
    isPopular: true,
    brand: 'Puma'
  },
  {
    name: 'Anker 737 Power Bank PowerCore 24K (140W Output)',
    description: 'Ultra-powerful 24,000mAh portable charger with 140W bi-directional fast charging and smart digital display output monitor.',
    price: 13999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1622445268465-843d61463a73?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 175 },
    stock: 35,
    isFeatured: false,
    isPopular: true,
    brand: 'Anker'
  },
  {
    name: 'Philips Sonicare ExpertClean 7300 Smart Toothbrush',
    description: 'Removes up to 10x more plaque than a manual toothbrush. Built-in pressure sensor, 3 modes, 3 intensities & Bluetooth app tracking.',
    price: 12499,
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.6, count: 82 },
    stock: 18,
    isFeatured: false,
    isPopular: false,
    brand: 'Philips'
  },
  {
    name: 'Marshall Stanmore III Wireless Bluetooth Speaker',
    description: 'Wider soundstage icon with brass control knobs, vintage vinyl casing, Bluetooth 5.2, and custom-tuned stereo audio.',
    price: 31999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 310 },
    stock: 12,
    isFeatured: true,
    isPopular: true,
    brand: 'Marshall'
  },
  {
    name: 'Dyson Airwrap Multi-Styler Complete Long',
    description: 'Styles hair using Coanda airflow without extreme heat. Includes re-engineered barrels to curl, wave, smooth, and dry.',
    price: 45900,
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 420 },
    stock: 8,
    isFeatured: true,
    isPopular: true,
    brand: 'Dyson'
  },
  {
    name: 'GoPro HERO12 Black Waterproof Action Camera',
    description: '5.3K video capture with HDR, HyperSmooth 6.0 video stabilization, Bluetooth audio connectivity, and 33ft waterproof body.',
    price: 38990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 195 },
    stock: 14,
    isFeatured: false,
    isPopular: true,
    brand: 'GoPro'
  },
  {
    name: 'Nike Utility Power Training Duffel Backpack',
    description: 'Durable canvas construction with multiple zippered external pockets, padded shoulder straps, and dedicated shoe ventilation pocket.',
    price: 4295,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 290 },
    stock: 30,
    isFeatured: false,
    isPopular: false,
    brand: 'Nike'
  },
  {
    name: 'Philips Hue Play Light Bar Dual Pack Ambient RGB',
    description: 'Versatile light bar featuring 16 million colors, TV screen synchronization, customizable scenes, and voice control.',
    price: 14999,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.6, count: 110 },
    stock: 25,
    isFeatured: false,
    isPopular: true,
    brand: 'Philips'
  },
  {
    name: 'Theragun PRO G5 Deep Tissue Percussive Massager',
    description: 'Commercial-grade deep muscle massage therapy device with QuietForce motor, OLED screen, customizable speed range, and 6 attachments.',
    price: 49990,
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.9, count: 154 },
    stock: 9,
    isFeatured: true,
    isPopular: false,
    brand: 'Theragun'
  },
  {
    name: 'Seiko 5 Sports Automatic Stainless Steel Watch',
    description: 'Iconic 4R36 automatic movement with 41-hour power reserve, hardlex crystal display, day/date display, and 100m water resistance.',
    price: 25000,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.8, count: 205 },
    stock: 14,
    isFeatured: true,
    isPopular: true,
    brand: 'Seiko'
  },
  {
    name: 'Nespresso Vertuo Pop Automatic Coffee Machine',
    description: 'Centrifusion technology reads capsule barcodes to brew smooth crema espresso, double espresso, or full cup coffee with one touch.',
    price: 16990,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    rating: { rate: 4.7, count: 135 },
    stock: 20,
    isFeatured: false,
    isPopular: true,
    brand: 'Nespresso'
  }
];

const seedDemoUser = {
  name: 'Recruiter Demo',
  email: 'demo@shop.com',
  password: 'password123',
  role: 'admin'
};

const importData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('ℹ️ MONGODB_URI not set. Skipping live DB seed import.');
      return;
    }
    await mongoose.connect(mongoUri);
    
    await Product.deleteMany();
    await User.deleteMany({ email: 'demo@shop.com' });

    await Product.insertMany(seedProducts);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(seedDemoUser.password, salt);
    await User.create({ ...seedDemoUser, password: hashedPassword });

    console.log('🎉 Seed Data Imported Successfully into MongoDB!');
    if (require.main === module) process.exit();
  } catch (error) {
    console.error(`❌ Error importing seed data: ${error.message}`);
    if (require.main === module) process.exit(1);
  }
};

module.exports = { seedProducts, seedDemoUser, importData };

if (require.main === module) {
  importData();
}
