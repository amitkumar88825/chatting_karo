const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const User = require("../models/user.schema");

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const createUsers = async () => {
  try {
    const USERS_COUNT = 1000;

    const hashedPassword = await bcrypt.hash("User@123", 10);

    const users = [];

    for (let i = 0; i < USERS_COUNT; i++) {
      users.push({
        username: faker.internet.username(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        profilePic: faker.image.avatar(),
        friends: [],
      });
    }

    // insert all users
    await User.insertMany(users);

    console.log(`${USERS_COUNT} users created successfully 🚀`);
    process.exit();
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
};

createUsers();