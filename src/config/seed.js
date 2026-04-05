require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');
const Payment = require('../models/payment.model');

const { ROLES, COUNTRIES, PAYMENT_METHODS } = require('../constants');

const seed = async () => {
  await connectDB();

  console.log('🌱 Clearing existing data...');
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Payment.deleteMany({});

  const hashPass = async (pw) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(pw, salt);
  };

  // ─── Users ────────────────────────────────────────────────────────────────────
  console.log('👥 Seeding users...');
  const users = await User.insertMany([
    {
      name: 'Nick Fury',
      email: 'nick.fury@shield.com',
      password: await hashPass('admin@123'),
      role: ROLES.ADMIN,
      country: COUNTRIES.AMERICA,
    },
    {
      name: 'Captain Marvel',
      email: 'captain.marvel@shield.com',
      password: await hashPass('manager@123'),
      role: ROLES.MANAGER,
      country: COUNTRIES.INDIA,
    },
    {
      name: 'Captain America',
      email: 'captain.america@shield.com',
      password: await hashPass('manager@123'),
      role: ROLES.MANAGER,
      country: COUNTRIES.AMERICA,
    },
    {
      name: 'Thanos',
      email: 'thanos@shield.com',
      password: await hashPass('member@123'),
      role: ROLES.MEMBER,
      country: COUNTRIES.INDIA,
    },
    {
      name: 'Thor',
      email: 'thor@shield.com',
      password: await hashPass('member@123'),
      role: ROLES.MEMBER,
      country: COUNTRIES.INDIA,
    },
    {
      name: 'Travis',
      email: 'travis@shield.com',
      password: await hashPass('member@123'),
      role: ROLES.MEMBER,
      country: COUNTRIES.AMERICA,
    },
  ]);

  console.log(`✅ ${users.length} users created`);

  // ─── Restaurants ──────────────────────────────────────────────────────────────
  console.log('🍽️  Seeding restaurants...');
  const restaurants = await Restaurant.insertMany([
    {
      name: 'Spice Garden',
      country: COUNTRIES.INDIA,
      cuisine: 'Indian',
      address: '12 MG Road, Bangalore, India',
      rating: 4.5,
      menuItems: [
        { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 350, category: 'Main Course' },
        { name: 'Dal Makhani', description: 'Slow-cooked black lentils in cream', price: 250, category: 'Main Course' },
        { name: 'Garlic Naan', description: 'Freshly baked garlic flatbread', price: 60, category: 'Bread' },
        { name: 'Mango Lassi', description: 'Chilled mango yogurt drink', price: 120, category: 'Beverage' },
        { name: 'Gulab Jamun', description: 'Soft milk dumplings in rose syrup', price: 80, category: 'Dessert' },
      ],
    },
    {
      name: 'Mumbai Bites',
      country: COUNTRIES.INDIA,
      cuisine: 'Street Food',
      address: '5 Linking Road, Mumbai, India',
      rating: 4.2,
      menuItems: [
        { name: 'Vada Pav', description: 'Spiced potato dumpling in a bun', price: 40, category: 'Snacks' },
        { name: 'Pav Bhaji', description: 'Spiced mashed veggies with buttered buns', price: 120, category: 'Main Course' },
        { name: 'Bhel Puri', description: 'Puffed rice mix with chutneys', price: 60, category: 'Snacks' },
        { name: 'Cutting Chai', description: 'Half cup of strong Indian tea', price: 20, category: 'Beverage' },
        { name: 'Kulfi Falooda', description: 'Rose milk with ice cream and noodles', price: 150, category: 'Dessert' },
      ],
    },
    {
      name: "Tony's Diner",
      country: COUNTRIES.AMERICA,
      cuisine: 'American',
      address: '99 5th Avenue, New York, USA',
      rating: 4.7,
      menuItems: [
        { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce & pickles', price: 14, category: 'Burgers' },
        { name: 'BBQ Bacon Burger', description: 'Smoked bacon with BBQ sauce', price: 16, category: 'Burgers' },
        { name: 'Loaded Fries', description: 'Fries with cheese sauce and jalapeños', price: 8, category: 'Sides' },
        { name: 'Chocolate Milkshake', description: 'Thick creamy chocolate shake', price: 7, category: 'Beverage' },
        { name: 'New York Cheesecake', description: 'Classic dense cream cheese cake', price: 10, category: 'Dessert' },
      ],
    },
    {
      name: 'Stars & Stripes Grill',
      country: COUNTRIES.AMERICA,
      cuisine: 'BBQ',
      address: '400 Sunset Blvd, Los Angeles, USA',
      rating: 4.4,
      menuItems: [
        { name: 'BBQ Ribs (Half Rack)', description: 'Slow smoked pork ribs with house sauce', price: 22, category: 'Mains' },
        { name: 'Smoked Brisket', description: '12-hour smoked beef brisket', price: 18, category: 'Mains' },
        { name: 'Coleslaw', description: 'Creamy house coleslaw', price: 5, category: 'Sides' },
        { name: 'Cornbread', description: 'Sweet Southern-style cornbread', price: 4, category: 'Sides' },
        { name: 'Iced Tea', description: 'Southern sweet iced tea', price: 4, category: 'Beverage' },
      ],
    },
  ]);

  console.log(`✅ ${restaurants.length} restaurants created`);

  // ─── Payment Methods ──────────────────────────────────────────────────────────
  console.log('💳 Seeding payment methods for Nick Fury (Admin)...');
  const nickFury = users.find((u) => u.name === 'Nick Fury');
  await Payment.insertMany([
    {
      userId: nickFury._id,
      method: PAYMENT_METHODS.CARD,
      details: {
        cardLast4: '4242',
        cardBrand: 'Visa',
        billingName: 'Nick Fury',
      },
      isDefault: true,
    },
    {
      userId: nickFury._id,
      method: PAYMENT_METHODS.CARD,
      details: {
        cardLast4: '1111',
        cardBrand: 'Mastercard',
        billingName: 'Nick Fury',
      },
      isDefault: false,
    },
  ]);

  // Payment for Captain Marvel (India Manager)
  const captainMarvel = users.find((u) => u.name === 'Captain Marvel');
  await Payment.create({
    userId: captainMarvel._id,
    method: PAYMENT_METHODS.UPI,
    details: { upiId: 'captainmarvel@upi', billingName: 'Captain Marvel' },
    isDefault: true,
  });

  // Payment for Captain America (America Manager)
  const captainAmerica = users.find((u) => u.name === 'Captain America');
  await Payment.create({
    userId: captainAmerica._id,
    method: PAYMENT_METHODS.CARD,
    details: { cardLast4: '0001', cardBrand: 'Amex', billingName: 'Captain America' },
    isDefault: true,
  });

  console.log('✅ Payment methods created');

  // ─── Summary ──────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed complete! Here are the login credentials:\n');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│  Name              │ Email                      │ Password   │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│  Nick Fury (ADMIN) │ nick.fury@shield.com       │ admin@123  │');
  console.log('│  Captain Marvel    │ captain.marvel@shield.com  │ manager@123│');
  console.log('│  Captain America   │ captain.america@shield.com │ manager@123│');
  console.log('│  Thanos            │ thanos@shield.com          │ member@123 │');
  console.log('│  Thor              │ thor@shield.com            │ member@123 │');
  console.log('│  Travis            │ travis@shield.com          │ member@123 │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
