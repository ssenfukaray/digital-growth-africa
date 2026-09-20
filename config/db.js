const mongoose = require("mongoose");

const connectDB = async () => {
  const connections = [
    { label: "MongoDB cluster", uri: process.env.MONGODB_URI },
    { label: "Local MongoDB", uri: process.env.MONGO_URI },
  ].filter((connection) => connection.uri);

  if (connections.length === 0) {
    console.warn("MongoDB URI missing. Set MONGODB_URI in Backend/.env.");
    return;
  }

  for (const connection of connections) {
    if (connection.uri.includes("<db_password>")) {
      console.warn(`${connection.label} skipped: replace <db_password> in Backend/.env first.`);
      continue;
    }

    try {
      await mongoose.connect(connection.uri, {
        serverSelectionTimeoutMS: 7000,
      });
      console.log(`${connection.label} connected`);
      return;
    } catch (error) {
      console.error(`${connection.label} connection failed:`, error.message);
      await mongoose.disconnect().catch(() => {});
    }
  }

  console.warn("API will continue running. Audit leads will be saved locally until MongoDB is available.");
};

module.exports = connectDB;
