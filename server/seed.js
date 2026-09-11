/**
 * seed.js — One-time database seed for HaatLink.
 *
 * Run with: node seed.js
 *
 * Safety: only inserts if the collection is currently empty.
 * Does NOT drop or reset existing data.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Crop from './models/Crop.js';
import Buyer from './models/Buyer.js';
import Market from './models/Market.js';
import Requirement from './models/Requirement.js';
import Deal from './models/Deal.js';
import Notification from './models/Notification.js';
import Offer from './models/Offer.js';

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Check your .env file.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB:', mongoose.connection.host);

  // ── Crops ──────────────────────────────────────────────────
  const cropCount = await Crop.countDocuments();
  if (cropCount === 0) {
    await Crop.insertMany([
      {
        name: 'Onion',
        quantity: 80,
        quality: 'Grade A',
        harvestDate: '2026-09-08',
        status: 'Ready to Sell',
        price: 2450,
        emoji: '🧅',
      },
      {
        name: 'Tomato',
        quantity: 40,
        quality: 'Grade A',
        harvestDate: '2026-10-22',
        status: 'Growing',
        price: 1850,
        emoji: '🍅',
      },
      {
        name: 'Potato',
        quantity: 60,
        quality: 'Grade B',
        harvestDate: '2026-09-04',
        status: 'Ready to Sell',
        price: 1950,
        emoji: '🥔',
      },
    ]);
    console.log('✓ Seeded crops');
  } else {
    console.log(`  Crops already have ${cropCount} records — skipped.`);
  }

  // ── Buyers ─────────────────────────────────────────────────
  const buyerCount = await Buyer.countDocuments();
  if (buyerCount === 0) {
    await Buyer.insertMany([
      {
        name: 'ABC Foods',
        crop: 'Onion',
        price: 2700,
        required: 100,
        quality: 'Grade A',
        pickup: true,
        paymentDays: 3,
        trust: 94,
        distance: 170,
        transport: 160,
        handling: 20,
        verified: true,
      },
      {
        name: 'FreshMart Retail',
        crop: 'Onion',
        price: 2670,
        required: 80,
        quality: 'Grade A',
        pickup: true,
        paymentDays: 5,
        trust: 86,
        distance: 165,
        transport: 145,
        handling: 20,
        verified: true,
      },
      {
        name: 'Nashik Fresh Produce',
        crop: 'Onion',
        price: 2540,
        required: 120,
        quality: 'Grade A',
        pickup: false,
        paymentDays: 2,
        trust: 91,
        distance: 24,
        transport: 28,
        handling: 15,
        verified: true,
      },
      {
        name: 'XYZ Agro Exports',
        crop: 'Onion',
        price: 2620,
        required: 60,
        quality: 'Grade A',
        pickup: true,
        paymentDays: 7,
        trust: 89,
        distance: 120,
        transport: 105,
        handling: 20,
        verified: true,
      },
      {
        name: 'GreenBasket Foods',
        crop: 'Onion',
        price: 2590,
        required: 90,
        quality: 'Grade B',
        pickup: false,
        paymentDays: 4,
        trust: 82,
        distance: 85,
        transport: 75,
        handling: 18,
        verified: false,
      },
    ]);
    console.log('✓ Seeded buyers');
  } else {
    console.log(`  Buyers already have ${buyerCount} records — skipped.`);
  }

  // ── Markets ────────────────────────────────────────────────
  const marketCount = await Market.countDocuments();
  if (marketCount === 0) {
    await Market.insertMany([
      {
        crop: 'Onion',
        average: 2480,
        change: 8.4,
        predicted: 2650,
        demand: 'High',
        markets: [
          { name: 'Nashik APMC', price: 2450, distance: '18 km' },
          { name: 'Pune APMC', price: 2620, distance: '165 km' },
          { name: 'Mumbai Market', price: 2700, distance: '170 km' },
          { name: 'Ahmednagar APMC', price: 2520, distance: '120 km' },
        ],
      },
      {
        crop: 'Tomato',
        average: 1850,
        change: 3.1,
        predicted: 1910,
        demand: 'Moderate',
        markets: [
          { name: 'Nashik APMC', price: 1850, distance: '18 km' },
          { name: 'Pune APMC', price: 1900, distance: '165 km' },
          { name: 'Mumbai Market', price: 1980, distance: '170 km' },
        ],
      },
      {
        crop: 'Potato',
        average: 1950,
        change: -1.8,
        predicted: 1900,
        demand: 'Moderate',
        markets: [
          { name: 'Nashik APMC', price: 1950, distance: '18 km' },
          { name: 'Pune APMC', price: 2020, distance: '165 km' },
          { name: 'Mumbai Market', price: 2080, distance: '170 km' },
        ],
      },
    ]);
    console.log('✓ Seeded markets');
  } else {
    console.log(`  Markets already have ${marketCount} records — skipped.`);
  }

  // ── Requirements ───────────────────────────────────────────
  const requirementCount = await Requirement.countDocuments();
  if (requirementCount === 0) {
    await Requirement.insertMany([
      {
        crop: 'Onion',
        quantity: 500,
        received: 320,
        quality: 'Grade A',
        offeredPrice: 2700,
        requiredBy: '2026-09-22',
        location: 'Pune, Maharashtra',
        paymentTerms: 'Within 7 days',
        notes: 'Farm pickup preferred for Grade A produce.',
        status: 'Active',
      },
      {
        crop: 'Tomato',
        quantity: 200,
        received: 90,
        quality: 'Grade A',
        offeredPrice: 1900,
        requiredBy: '2026-09-29',
        location: 'Pune, Maharashtra',
        paymentTerms: 'Within 7 days',
        notes: '',
        status: 'Active',
      },
    ]);
    console.log('✓ Seeded requirements');
  } else {
    console.log(`  Requirements already have ${requirementCount} records — skipped.`);
  }

  // ── Deals ──────────────────────────────────────────────────
  const dealCount = await Deal.countDocuments();
  if (dealCount === 0) {
    await Deal.insertMany([
      {
        crop: 'Onion',
        quantity: 80,
        buyer: 'ABC Foods',
        price: 2700,
        total: 216000,
        status: 'Pickup Scheduled',
        created: '2026-09-10',
        net: 2520,
      },
    ]);
    console.log('✓ Seeded deals');
  } else {
    console.log(`  Deals already have ${dealCount} records — skipped.`);
  }

  // ── Notifications ──────────────────────────────────────────
  const notificationCount = await Notification.countDocuments();
  if (notificationCount === 0) {
    await Notification.insertMany([
      {
        title: 'Onion prices are rising',
        text: 'Nashik APMC gained 8.4% this week.',
        time: '1h ago',
      },
      {
        title: 'Buyer match found',
        text: 'ABC Foods is a strong match for your Onion.',
        time: '3h ago',
      },
    ]);
    console.log('✓ Seeded notifications');
  } else {
    console.log(`  Notifications already have ${notificationCount} records — skipped.`);
  }

  // ── Offers ─────────────────────────────────────────────────
  const offerCount = await Offer.countDocuments();
  if (offerCount === 0) {
    await Offer.insertMany([
      {
        farmer: 'Nashik FPO',
        crop: 'Onion',
        quantity: 100,
        quality: 'Grade A',
        price: 2580,
        buyer: 'ABC Foods',
        message: '',
        status: 'Pending',
      },
      {
        farmer: 'Ramesh Patil',
        crop: 'Onion',
        quantity: 80,
        quality: 'Grade A',
        price: 2700,
        buyer: 'ABC Foods',
        message: '',
        status: 'Pending',
      },
    ]);
    console.log('✓ Seeded offers');
  } else {
    console.log(`  Offers already have ${offerCount} records — skipped.`);
  }

  await mongoose.disconnect();
  console.log('\nSeed complete. MongoDB disconnected.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
