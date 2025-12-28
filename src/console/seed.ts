import runSeeders from "./seedRunner";

runSeeders().catch((err) => {
  console.error("Seeder runner failed:", err);
  process.exit(1);
});
