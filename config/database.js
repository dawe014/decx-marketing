import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Consider throwing the error or handling it appropriately
    // throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB;