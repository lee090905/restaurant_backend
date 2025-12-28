import app from "./app";
import runSeeders from "./console/seedRunner";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Run seeders at startup (non-fatal — log errors but continue)
    await runSeeders();
  } catch (err) {
    console.error("Error running seeders at startup:", err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
