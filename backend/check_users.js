const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const users = await User.find().select('+password');
    for (let u of users) {
      console.log(`User: ${u.email}, Password: ${u.password}, IsActive: ${u.isActive}`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
