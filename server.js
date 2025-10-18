import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public
app.use(express.static('public'));

// Serve index.html on /
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
