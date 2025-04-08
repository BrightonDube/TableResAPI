const mongoose = require('mongoose');

const restaurantInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  openingHours: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  website: {
    type: String,
    trim: true,
    maxlength: 200,
    validate: { 
      validator: function(v) {
        if (!v) return true;
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
 
}, { timestamps: true }); 
const RestaurantInfo = mongoose.model('RestaurantInfo', restaurantInfoSchema);

module.exports = RestaurantInfo;