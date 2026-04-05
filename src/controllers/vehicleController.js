import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';

export const getAllVehicles = async (req, res) => {
  try {
    const { province, district } = req.query;
    const filter = {};
    if (province) filter.province = province;
    if (district) filter.district = district;

    const vehicles = await Vehicle.find(filter)
      .populate('driver', 'name licenseNumber phone')
      .populate('district', 'name')
      .populate('province', 'name');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('driver', 'name licenseNumber phone')
      .populate('district', 'name')
      .populate('province', 'name');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, driver, district, province, color, year, deviceId } = req.body;
    const vehicle = await Vehicle.create({
      registrationNumber,
      driver,
      district,
      province,
      color,
      year,
      deviceId
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};