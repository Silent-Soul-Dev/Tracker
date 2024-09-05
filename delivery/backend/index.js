const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://aryanmain21:unnKWDrlRxrWUxkj@delivery.mwbye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a model for storing location data
const LocationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', LocationSchema);

// Create an API endpoint to receive location data
app.post('/api/updateLocation', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();
    res.status(201).send('Location saved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error saving location' });
  }
});

// Fetch location from IP
app.get('/api/location', async (req, res) => {
  try {
    const response = await axios.get('https://ipinfo.io/json?token=7af3db55d50d33');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching location data:', error.message);
    res.status(500).json({ message: 'Error fetching location data' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
