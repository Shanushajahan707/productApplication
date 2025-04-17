import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()
const MONGO_STR = process.env.MONGO_STR;
const dbName = 'productApplication';

export async function connectDatabase() {
  try {
    if(MONGO_STR){
        await mongoose.connect(MONGO_STR, {
          dbName, 
        });
        console.log(`Connected to MongoDB database: ${dbName}`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
}