const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// Connect to MongoDB. Remove Db connection for now
connectDB() 

const app = express()

// Body parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Method Over-ride.
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Appliction Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


// Handlebar Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({ helpers: {
  formatDate,
  stripTags, 
  truncate,
  editIcon,
  select
}, 
defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Express session middleware
app.use(session({
    secret: 'pizza slice',
    resave: false,
    saveUninitialized: false,    
    store:  new MongoStore({
        uri: process.env.MONGO_URI,
        collection: 'userSessions'
      })   

}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash middleware
app.use(flash());

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');    
    next()
})

// Static Assets folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/events', require('./routes/events'))
app.use('/profile', require('./routes/profile'))
app.use('/settings', require('./routes/settings'))
app.use('/categories', require('./routes/categories'))

// Error message when Route not found
app.use(function(req, res, next){
    res.status(404);  
    // respond with html page
    if (req.accepts('html')) {
      res.render('error/404', { url: req.url });
      return;
    }
  });
// End Error message




const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
)

