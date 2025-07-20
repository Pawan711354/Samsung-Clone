const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Make sure you installed node-fetch@2
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy chat request to Rasa
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: "user", message }) // include sender!
    });

    const data = await response.json(); // ✅ FIXED: using 'response', not 'rasaResponse'
    return res.json(data);

  } catch (error) {
    console.error('Error communicating with Rasa:', error);
    return res.status(500).json({ error: 'Error communicating with Rasa server' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
