var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Handlebars = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const VaccineListRouter = require('./routes/Vaccine_list');
const FAQRouter = require('./routes/FAQ');
const config = require('./config')
const resgisterVaccination = require('./routes/registerVaccinational')
const vaccineRouter = require('./routes/vaccine')
const categoryRouter = require('./routes/category')
const branchRouter = require('./routes/branch')
var app = express();

// view engine setup
Handlebars.registerHelper('selectDistrics', function(cityList, idCity){
  let districtsList = cityList.filter(item => item.province_code == idCity)
  return districtsList
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/Vaccine_list', VaccineListRouter);
app.use('/FAQ', FAQRouter);
app.use('/register-vaccination', resgisterVaccination)
app.use('/vaccine', vaccineRouter)
app.use('/category', categoryRouter)
app.use('/branch', branchRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/*Connect mongodb*/
const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
mongoose.connect(config.URL_MONGODB,connectionParams)
  .then( () => {
      console.log('Connected to mongoBD!!')
  })
  .catch( (err) => {
      console.error(`Error connecting to the mongoDb. \n${err}`);
  })

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
