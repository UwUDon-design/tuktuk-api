import District from '../models/District.js';

export const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find().populate('province', 'name code');
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id).populate('province', 'name code');
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.json(district);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createDistrict = async (req, res) => {
  try {
    const { name, code, province } = req.body;
    const district = await District.create({ name, code, province });
    res.status(201).json(district);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};