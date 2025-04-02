const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const expressLayouts = require('express-ejs-layouts');

//dot en configuration
dotenv.config();

//DB connection
connectDb();

//rest object
const app = express();
const path = require('path');
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass user data to EJS templates
  next();
});

// Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use express-ejs-layouts for layouts
app.use(expressLayouts);

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//route
// URL => http://localhost:8080
app.use('/api/v1/test', require('./routes/testRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/resturant', require('./routes/resturantRoutes'));
app.use('/api/v1/category', require('./routes/catgeoryRoutes'));
app.use('/api/v1/food', require('./routes/foodRoutes'));

app.get('/', (req, res) => {
  return res.status(200).render('home');
});

//PORT
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.white.bgMagenta);
});
