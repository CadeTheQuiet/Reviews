const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/reviews', (req, res) => {
  fs.readFile('reviews.json', (err, data) => {
    if (err) return res.status(500).send({ error: 'Cannot read reviews' });
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));