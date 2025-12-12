import app from './app';
import dotenv from 'dotenv';
import { runWorker } from './services/schedulerService';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    runWorker();
});