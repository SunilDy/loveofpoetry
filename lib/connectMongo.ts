import mongoose from 'mongoose';

mongoose.set('strictQuery', false)
// @ts-ignore
const connectMongo = async () => mongoose.connect(process.env.DB_URL);

export default connectMongo;