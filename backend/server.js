const app = require('./app'); 

const port = 3000;

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
  console.log(`Connecting to DB host: ${process.env.DB_HOST}`);
});