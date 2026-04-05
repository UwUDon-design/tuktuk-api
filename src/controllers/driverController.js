import Driver from '../models/Driver.js';

export const getAllDrivers = async (req, res) => {
  try {
    const { district } = req.query;
    const filter = {};
    if (district) filter.district = district;

    const drivers = await Driver.find(filter)
      .populate('district', 'name');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('district', 'name');
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { name, licenseNumber, phone, nationalId, district } = req.body;
    const driver = await Driver.create({
      name,
      licenseNumber,
      phone,
      nationalId,
      district
    });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};