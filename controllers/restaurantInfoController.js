const RestaurantInfo = require('../models/RestaurantInfo');

exports.getRestaurantInfo = async (req, res, next) => {
  try {
    const restaurantInfo = await RestaurantInfo.findOne({});
    if (!restaurantInfo) {
      return res
        .status(200)
        .json({
          success: true,
          message: 'Restaurant information not set up yet.',
          restaurantInfo: null,
        });
    }
    res.status(200).json({ success: true, restaurantInfo });
  } catch (error) {
    console.error('Error getting restaurant info:', error);
    next(error);
  }
};

exports.upsertRestaurantInfo = async (req, res, next) => {
  try {
    const updates = req.body;

    const restaurantInfo = await RestaurantInfo.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({
        success: true,
        message: 'Restaurant information updated successfully.',
        restaurantInfo,
      });
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    if (error.name === 'ValidationError') {
      
      const messages = Object.values(error.errors).map((val) => val.message);
      const validationError = new Error(
        `Validation Failed: ${messages.join(', ')}`
      );
      validationError.statusCode = 400;
      return next(validationError);
    }
    next(error);
  }
};

exports.deleteRestaurantInfo = async (req, res, next) => {
  try {
    const deletedInfo = await RestaurantInfo.findOneAndDelete({});
    if (!deletedInfo) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'Restaurant information not found to delete.',
        });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting restaurant info:', error);
    next(error);
  }
};
