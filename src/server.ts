import app from './app';
import runSeeders from './console/seedRunner';
import cors from 'cors';

app.use(cors());

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await runSeeders();
  } catch (err) {
    console.error('Error running seeders at startup:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost: ${PORT}`);
  });
})();
