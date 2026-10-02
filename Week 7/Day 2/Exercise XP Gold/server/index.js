const app = require('./app');
const database = require('./config/database');

const port = process.env.PORT || 5000;

async function startServer() {
  await database.migrate.latest();
  app.listen(port, () => {
    console.log(`Todo API listening on port ${port}`);
  });
}

startServer().catch(async (error) => {
  console.error('Could not start the Todo API:', error.message);
  await database.destroy();
  process.exitCode = 1;
});