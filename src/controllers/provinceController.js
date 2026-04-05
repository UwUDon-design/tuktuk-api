import Province from '../models/Province.js';
import District from '../models/District.js';

export const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProvinceById = async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) {
      return res.status(404).json({ message: 'Province not found' });
    }
    res.json(province);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createProvince = async (req, res) => {
  try {
    const { name, code } = req.body;
    const province = await Province.create({ name, code });
    res.status(201).json(province);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getDistrictsByProvince = async (req, res) => {
  try {
    const districts = await District.find({ province: req.params.id });
    res.json(districts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};