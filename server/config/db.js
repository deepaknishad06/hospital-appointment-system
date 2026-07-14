const dns = require("dns");
const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is required in environment variables");
  }

  // If Node's DNS resolver has trouble with SRV lookups, set a reliable DNS server.
  // This helps resolve Atlas SRV records when the system resolver used by Node fails.
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.log("DNS servers set to 8.8.8.8,1.1.1.1 for SRV resolution");
  } catch (e) {
    console.warn("Could not set DNS servers:", e.message);
  }

  // Mongoose >=6 no longer requires useNewUrlParser/useUnifiedTopology options
  mongoose.set("strictQuery", false);

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB Atlas");
};

module.exports = connectDB;
