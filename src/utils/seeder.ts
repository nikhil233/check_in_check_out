import mongoose from 'mongoose';
import Room from '../models/Room.js';
import Amenity from '../models/Amenity.js';
import 'dotenv/config';
import { faker } from '@faker-js/faker';

// Realistic hotel amenities
const amenitiesData = [
  { name: 'Towel', condition: 'good', charge: 100 },
  { name: 'Soap', condition: 'good', charge: 50 },
  { name: 'Shampoo', condition: 'good', charge: 75 },
  { name: 'Toothbrush', condition: 'good', charge: 40 },
  { name: 'Toothpaste', condition: 'good', charge: 40 },
  { name: 'Water Bottle', condition: 'good', charge: 30 },
  { name: 'Bathrobe', condition: 'good', charge: 200 },
  { name: 'Slippers', condition: 'good', charge: 60 },
  { name: 'Hair Dryer', condition: 'good', charge: 300 },
  { name: 'Comb', condition: 'good', charge: 25 },
  { name: 'Shaving Kit', condition: 'good', charge: 80 },
  { name: 'Sewing Kit', condition: 'good', charge: 35 },
  { name: 'Coffee Maker', condition: 'good', charge: 500 },
  { name: 'Tea Bags', condition: 'good', charge: 20 },
  { name: 'Mini Fridge', condition: 'good', charge: 800 },
  { name: 'TV Remote', condition: 'good', charge: 150 },
  { name: 'Pillow', condition: 'good', charge: 120 },
  { name: 'Blanket', condition: 'good', charge: 180 },
  { name: 'Curtains', condition: 'good', charge: 250 },
  { name: 'Desk Lamp', condition: 'good', charge: 220 },
];

// Generate 100 rooms
const roomsData = Array.from({ length: 100 }, (_, i) => ({
  number: (100 + i).toString(),
}));

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotel');
  console.log('Connected to MongoDB for seeding');

  await Room.deleteMany({});
  await Amenity.deleteMany({});

  const amenities = await Amenity.insertMany(amenitiesData);
  console.log('Seeded amenities:', amenities.map(a => a.name));

  for (const room of roomsData) {
    // Each room gets 5-10 random amenities
    const roomAmenities = faker.helpers.arrayElements(amenities, faker.number.int({ min: 5, max: 10 }));
    await Room.create({
      number: room.number,
      amenities: roomAmenities.map((a: any) => a._id),
      isOccupied: false,
    });
  }
  console.log('Seeded rooms:', roomsData.map(r => r.number));

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 