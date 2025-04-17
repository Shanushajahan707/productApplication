import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './providers/database';
import userRoutes from './routes/userRoutes';
// import recruiterRoutes from './routes/recruiterRoutes';

dotenv.config();
connectDatabase()

const port = process.env.PORT || 5000;

app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });