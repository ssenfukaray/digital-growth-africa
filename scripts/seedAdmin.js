const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

async function seedAdmin() {
  const { MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required.');
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required. Add them to Backend/.env or set them before running this script.');
  }

  await mongoose.connect(MONGODB_URI);

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const user = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase().trim() },
    {
      name: ADMIN_NAME || 'Admin',
      email: ADMIN_EMAIL.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    },
    { new: true, upsert: true, runValidators: true }
  ).select('-password');

  console.log(`Admin ready: ${user.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
