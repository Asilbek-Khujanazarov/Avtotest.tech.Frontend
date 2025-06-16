const express = require('express');
const path = require('path');

const app = express();

// Statik fayllarni xizmat ko'rsatish
app.use(express.static(path.join(__dirname, 'dist/auto-test.frontend/browser')));

// SSR uchun barcha so'rovlarni yo'naltirish
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/auto-test.frontend/browser/index.csr.html'));
});

// Portni sozlash
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});