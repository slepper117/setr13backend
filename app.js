import express from 'express';

// App Configs
const app = express();
const port = 3000;

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Server
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Example app listening on port ${port}`));
