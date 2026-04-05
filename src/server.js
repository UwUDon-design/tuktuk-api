import express from 'express';
import mongoose from 'mongoose';

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/tuktukdb';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Tuk-Tuk API is running!' });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));