import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './providers/database';
import userRoutes from './routes/userRoutes';
import brandRoutes from './routes/brandRoutes';
import productRoutes from './routes/productRoutes';
// import recruiterRoutes from './routes/recruiterRoutes';

dotenv.config();
connectDatabase()

const port = process.env.PORT || 5000;

app.use('/api/user', userRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/product', productRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });