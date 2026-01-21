import app from './app';
import runSeeders from './console/seedRunner';
import cors from 'cors';

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://restaurant-frontend.ssml8n.easypanel.host',
    ],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await runSeeders();
    }
  } catch (err) {
    console.error('Error running seeders at startup:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
