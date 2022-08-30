const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  //  2) Build template
  // 3) Render that data that we got from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};
