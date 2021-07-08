const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

// Connect to MongoDB. Remove Db connection for now
connectDB() 

const app = express()

// Appliction Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Express session middleware
app.use(session({
    secret: 'pizza slice',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    store:  new MongoStore({
        uri: process.env.MONGO_URI,
        collection: 'userSessions'
      })   

}))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
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

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
)

