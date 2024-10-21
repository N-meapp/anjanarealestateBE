var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const connectDb = require('./config/db')
const bodyParser = require('body-parser')
// const cors = require('cors')
require('dotenv').config(); 



var app = express(); 

connectDb()

console.log(process.env.CLOUDINARY_CLOUD_NAME, "cludinary");

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',  // Replace this with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  credentials: true  // Allow cookies to be sent with requests
};


app.use(bodyParser.json())

app.use(express.urlencoded({ extended: true }));
// Apply CORS middleware
app.use(cors(corsOptions));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:5173', // Allow this specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers you are using
}));

// Alternatively, to allow all origins:
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
