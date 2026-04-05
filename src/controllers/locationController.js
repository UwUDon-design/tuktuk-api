import Location from '../models/Location.js';
import Vehicle from '../models/Vehicle.js';

export const addLocation = async (req, res) => {
  try {
    const { vehicleId, latitude, longitude, speed } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const location = await Location.create({
      vehicle: vehicleId,
      latitude,
      longitude,
      speed
    });

    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getLastLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ vehicle: req.params.vehicleId })
      .sort({ timestamp: -1 })
      .populate('vehicle', 'registrationNumber');
    if (!location) {
      return res.status(404).json({ message: 'No location found for this vehicle' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getLocationHistory = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { vehicle: req.params.vehicleId };

    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }

    const locations = await Location.find(filter)
      .sort({ timestamp: -1 })
      .populate('vehicle', 'registrationNumber');

    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllActiveLocations = async (req, res) => {
  try {
    const { province, district } = req.query;

    const vehicleFilter = { isActive: true };
    if (province) vehicleFilter.province = province;
    if (district) vehicleFilter.district = district;

    const vehicles = await Vehicle.find(vehicleFilter);
    const vehicleIds = vehicles.map(v => v._id);

    const locations = await Promise.all(
      vehicleIds.map(id =>
        Location.findOne({ vehicle: id })
          .sort({ timestamp: -1 })
          .populate('vehicle', 'registrationNumber province district')
      )
    );

    res.json(locations.filter(l => l !== null));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};