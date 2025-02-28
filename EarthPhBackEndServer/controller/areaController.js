const AreaModel = require('../models/areaModel');

// Controller to get all areas
async function getAreas(req, res) {
  console.log('GET /getAreas route hit');
  
  try {
    const areas = await AreaModel.find({});
    console.log("Fetched Areas:", areas);
    res.json({ areas });
  } catch (err) {
    console.error('Error fetching areas:', err);
    res.status(500).json({ message: 'Error fetching areas', error: err });
  }
}

// Controller to create a new area
async function createArea(req, res) {
  console.log('Request Body:', req.body);

  const { area, areaCode } = req.body;

  if (!area || !areaCode) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log("Validated Fields:", { area, areaCode });

  const newArea = new AreaModel({
    area,
    areaCode,
  });

  try {
    await newArea.save();
    res.json({ message: 'Area created successfully', area: newArea });
  } catch (err) {
    console.error('❌ MongoDB Save Error:', err.message);
    res.status(500).json({ message: 'Error creating area', error: err.message });
  }
}

// Controller to update an existing area
async function updateArea(req, res) {
  const { areaId } = req.params;
  const updateFields = req.body;

  // Remove empty or undefined fields from updateFields
  Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] === "" || updateFields[key] === undefined) {
          delete updateFields[key];
      }
  });

  try {
      if (Object.keys(updateFields).length === 0) {
          return res.status(400).json({ message: "No valid fields provided for update" });
      }

      const updatedArea = await AreaModel.findByIdAndUpdate(
          areaId,
          { $set: updateFields },
          { new: true }
      );

      if (!updatedArea) {
          return res.status(404).json({ message: "Area not found" });
      }

      res.json({ message: "Area updated successfully", area: updatedArea });
  } catch (err) {
      console.error("Error updating area:", err);
      res.status(500).json({ message: "Error updating area", error: err });
  }
}

// Controller to delete an area
async function deleteArea(req, res) {
  console.log('DELETE /deleteArea/:areaId route hit');

  const { areaId } = req.params;

  try {
    const deletedArea = await AreaModel.findByIdAndDelete(areaId);

    if (!deletedArea) {
      return res.status(404).json({ message: 'Area not found' });
    }

    res.json({
      message: 'Area deleted successfully',
      area: deletedArea,
    });
  } catch (err) {
    console.error('Error deleting area:', err);
    res.status(500).json({ message: 'Error deleting area', error: err });
  }
}

module.exports = { getAreas, createArea, updateArea, deleteArea };