const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventoryRoutes');
const UserModel = require('./models/userModel'); // Assuming UserModel has a 'saveToken' method
const cors = require('cors');

const app = express();

const apiMiddleware = async (req, res, next) =>{

    const token = req.cookies.token;
    console.log("middleware is called: ",token);
    const SECRET_KEY = process.env.SECRET_KEY; 
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided in cookies.' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(decoded); // Attach decoded token payload to the request object

        // verify token in database
        const user = await UserModel.getUserByToken(token);
        // Check if the user's ID is 0 and perform an operation
        if (user.id === 0) {    
            return res.status(401).json({ error: 'Token not present in db' });
        }
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    next();
}

const corsOptions = {
    origin: 'http://localhost:3001', // Allows requests from all origins. Replace '*' with specific domain(s) for stricter rules.
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods.
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers that are allowed.
    credentials: true, // Enables sending cookies over HTTP requests.
  };

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
// Routes
app.use('/auth', authRoutes);
app.use('/product',apiMiddleware,productRoutes)
app.use('/inventory',apiMiddleware, inventoryRoutes)

module.exports = app;
