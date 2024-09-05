// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://aryanmain21:unnKWDrlRxrWUxkj@delivery.mwbye.mongodb.net/?retryWrites=true&w=majority&appName=Delivery')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Location Schema
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
    return res.status(400).send('Latitude and Longitude are required');
  }

  try {
    const newLocation = new Location({ latitude, longitude });
    await newLocation.save();
    res.status(201).send('Location saved successfully');
  } catch (error) {
    res.status(500).send('Error saving location');
  }
});

// API to retrieve the most recent location data
app.get('/api/getLocation', async (req, res) => {
  try {
    const location = await Location.findOne().sort({ timestamp: -1 }); // Find the most recent location
    if (!location) {
      return res.status(404).send('No location data found');
    }
    res.status(200).json(location); // Send the most recent location as JSON response
  } catch (error) {
    res.status(500).send('Error fetching location');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
