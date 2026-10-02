const app = require('./app');
const database = require('./config/database');

const port = process.env.PORT || 5000;

async function startServer() {
  await database.migrate.latest();
  const [{ count }] = await database('questions').count({ count: '*' });
  if (Number(count) === 0) await database.seed.run();

  app.listen(port, () => {
    console.log(`Quiz game listening on http://localhost:${port}`);
  });
}

startServer().catch(async (error) => {
  console.error('Could not start the quiz game:', error.message);
  await database.destroy();
  process.exitCode = 1;
});