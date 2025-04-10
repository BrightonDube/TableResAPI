// tests/setup/seed-database.js
const mongoose = require('mongoose');
const User = require('../../models/User'); // Adjust paths to your models
const Table = require('../../models/Table');
const ReservationStatus = require('../../models/ReservationStatus');
const Reservation = require('../../models/Reservation');

async function seedDatabase() {
  try {
    // Clear existing data (optional, but often recommended for clean tests)
    await User.deleteMany({});
    await Table.deleteMany({});
    await ReservationStatus.deleteMany({});
    await Reservation.deleteMany({});

    // Seed Reservation Statuses (Example)
    const pendingStatus = await ReservationStatus.create({
      name: 'Pending',
      description: 'Awaiting confirmation',
    });
    const confirmedStatus = await ReservationStatus.create({
      name: 'Confirmed',
      description: 'Reservation confirmed',
    });
    const seatedStatus = await ReservationStatus.create({
      name: 'Seated',
      description: 'Guests are seated',
    });
    const cancelledStatus = await ReservationStatus.create({
      name: 'Cancelled',
      description: 'Reservation cancelled',
    });

    // Seed Users (Example)
    const testUser = await User.create({
      googleId: 'test-google-id-1',
      name: 'Test User 1',
      email: 'test1@example.com',
    });
    const anotherUser = await User.create({
      googleId: 'test-google-id-2',
      name: 'Test User 2',
      email: 'test2@example.com',
    });

    // Seed Tables (Example)
    const table1 = await Table.create({
      tableNumber: 'T101',
      capacity: 4,
      location: 'Patio',
    });
    const table2 = await Table.create({
      tableNumber: 'T102',
      capacity: 2,
      location: 'Indoor',
    });

    // Seed Reservations (Example)
    await Reservation.create({
      tableId: table1._id,
      customerName: 'John Smith',
      reservationTime: new Date('2024-08-20T19:00:00Z'),
      partySize: 2,
      status: pendingStatus._id, // Use _id of seeded status
    });
    await Reservation.create({
      tableId: table2._id,
      customerName: 'Jane Doe',
      reservationTime: new Date('2024-08-21T20:30:00Z'),
      partySize: 4,
      status: confirmedStatus._id, // Use _id of seeded status
    });
    return {
      // Return an object with the IDs
      table1Id: table1._id.toString(), // Return IDs as strings for easier use in tests
      reservation1Id: reservation1._id.toString(),
      // ... return other IDs if needed ...
    };

    console.log('Test database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error; // Re-throw to indicate setup failure
  }
}

module.exports = seedDatabase;
