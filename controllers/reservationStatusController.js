const ReservationStatus = require('../models/ReservationStatus');

exports.getAllReservationStatuses = async (req, res, next) => {
  try {
    const statuses = await ReservationStatus.find().sort({ name: 1 }); 
    res.status(200).json({ success: true, count: statuses.length, statuses });
  } catch (error) {
    console.error("Error getting all reservation statuses:", error);
    next(error);
  }
};

exports.createReservationStatus = async (req, res, next) => {
  try {
    const newStatus = await ReservationStatus.create(req.body);
    res.status(201).json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Error creating reservation status:", error);  
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('duplicate key')) {
       const duplicateError = new Error(`Reservation status name '${req.body.name}' already exists.`);
       duplicateError.statusCode = 400;
       return next(duplicateError);
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      const validationError = new Error(`Validation Failed: ${messages.join(', ')}`);
      validationError.statusCode = 400;
      return next(validationError);
    }
    next(error);
  }
};
exports.getReservationStatusById = async (req, res, next) => {
  try {
    const status = await ReservationStatus.findById(req.params.statusId);
    if (!status) {
      const error = new Error('Reservation status not found.');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, status });
  } catch (error) {
    console.error("Error getting reservation status by ID:", error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const castError = new Error('Invalid reservation status ID format.');
      castError.statusCode = 400;
      return next(castError);
    }
    next(error);
  }
};


exports.updateReservationStatus = async (req, res, next) => {
  try {
    const status = await ReservationStatus.findByIdAndUpdate(
        req.params.statusId,
        req.body,
        {
            new: true, 
            runValidators: true 
        }
    );

    if (!status) {
      const error = new Error('Reservation status not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, status });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    
    if (error.code === 11000 || error.name === 'MongoServerError' && error.message.includes('duplicate key')) {
       const duplicateError = new Error(`Reservation status name '${req.body.name}' already exists.`);
       duplicateError.statusCode = 400;
       return next(duplicateError);
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      const validationError = new Error(`Validation Failed: ${messages.join(', ')}`);
      validationError.statusCode = 400;
      return next(validationError);
    }
     if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const castError = new Error('Invalid reservation status ID format.');
      castError.statusCode = 400;
      return next(castError);
    }
    next(error);
  }
};


exports.deleteReservationStatus = async (req, res, next) => {
  try {
    const status = await ReservationStatus.findByIdAndDelete(req.params.statusId);

    if (!status) {
      const error = new Error('Reservation status not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.status(204).send(); 
  } catch (error) {
    console.error("Error deleting reservation status:", error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      const castError = new Error('Invalid reservation status ID format.');
      castError.statusCode = 400;
      return next(castError);
    }
    next(error);
  }
};