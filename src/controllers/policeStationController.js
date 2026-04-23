import PoliceStation from '../models/PoliceStation.js';

export const getAllStations = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.district) filter.district = req.query.district;
    if (req.query.province) filter.province = req.query.province;

    const stations = await PoliceStation.find(filter)
      .populate('district', 'name code')
      .populate('province', 'name code');

    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getStationById = async (req, res) => {
  try {
    const station = await PoliceStation.findById(req.params.id)
      .populate('district', 'name code')
      .populate('province', 'name code');

    if (!station) {
      return res.status(404).json({ message: 'Police station not found' });
    }

    res.json(station);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createStation = async (req, res) => {
  try {
    const { name, code, address, contactNumber, district, province } = req.body;
    const station = await PoliceStation.create({ name, code, address, contactNumber, district, province });
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateStation = async (req, res) => {
  try {
    const station = await PoliceStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!station) {
      return res.status(404).json({ message: 'Police station not found' });
    }
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const station = await PoliceStation.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Police station not found' });
    }
    res.json({ message: 'Police station deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
