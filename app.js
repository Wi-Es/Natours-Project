const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();
const userRouter = require('./routes/userRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES

//serving static files
app.use(express.static(path.join(__dirname, 'public')));
// set security http headers
app.use(helmet());

// dev logginf
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit too many requests from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from thi IP,please try in an hour '
});
app.use('/api', limiter);
//body parser: reading from body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
);
//Data sanitization NOSQL query injection
app.use(mongoSanitize());
//Data sanitization NOSQL XSS
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// app.get('/', (req, res) => {
//   res
//   .status(200)
//   .json({ message: 'Hello from the server side.', app: 'natours' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this end point');
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2) ROUTE HANDLERS

// 3) ROUTES

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hicker',
    user: 'Jonas'
  });
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// 4) START SERVER
module.exports = app;
