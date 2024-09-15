const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies


exec('py --version', (error, stdout, stderr) => {
  if (error) {
      console.error(`Error checking Python version: ${error.message}`);
      return;
  }
  console.log(`Python version: ${stdout}`);
});

// Endpoint to retrieve route data
app.get('/api/get-route', (req, res) => {
  exec('py get_route.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return res.status(500).json({ error: 'Error executing Python script' });
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      return res.status(500).json({ error: 'Python script error' });
    }

    try {
      const data = JSON.parse(stdout);  // Parse the JSON output from the Python script
      console.log('Fetching Data');
      res.json(data);
    } catch (parseError) {
      console.error(`Error parsing Python script output: ${parseError.message}`);
      res.status(500).json({ error: 'Error parsing Python script output' });
    }
  });
});

// New Endpoint to accept start and end locations
app.post('/api/send-locations', (req, res) => {
  const { startLocation, endLocation } = req.body;

  if (!startLocation || !endLocation) {
    return res.status(400).json({ error: 'Invalid start or end location' });
  }

  // Convert locations to strings for command-line arguments
  const startCoords = `${startLocation.latitude},${startLocation.longitude}`;
  const endCoords = `${endLocation.latitude},${endLocation.longitude}`;

  // Execute the Python script with start and end locations as arguments
  exec(`py get_route.py ${startCoords} ${endCoords}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return res.status(500).json({ error: 'Error executing Python script' });
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      return res.status(500).json({ error: 'Python script error' });
    }

    try {
      const data = JSON.parse(stdout); // Parse the JSON output from the Python script
      console.log('Calculating optimal route');
      res.json(data);
    } catch (parseError) {
      console.error(`Error parsing Python script output: ${parseError.message}`);
      res.status(500).json({ error: 'Error parsing Python script output' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
