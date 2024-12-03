// require('rootpath')();
// const express = require('express');
// const app = express();
// const cors = require('cors');
// const errorHandler = require('_middleware/error-handler');
// const path = require('path');
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser');
// // Configure CORS once with specific options
// // specify the frontend origin
// // allow cookies and other credentials to be sent
// app.use(cors({origin: 'http://localhost:4200', credentials: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'products')));

// app.use('/api/users', require('./users/user.controller'));
// app.use('/branches', require('./branches/branch.controller'));
// app.use('/warehouse', require('./warehouse/warehouse.controller'));
// app.use('/sales', require('./sales/sales.controller'));
// app.use('/orders', require('./orders/order.controller'));
// app.use('/products', require('./products/product.controller'));
// app.use('/inventory', require('./inventories/inventory.controller'));

// app.use('/api/products', express.static(path.join(__dirname, 'products')), require('./products/product.controller'));

// app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
// app.use('/accounts', require('./accounts/account.controller'));
// app.use('/api-docs', require('./_helpers/swagger'));

// app.use(errorHandler);

// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
// app.listen(port, () => console.log('Server listening on port ' + port));

require('rootpath')();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('_middleware/error-handler');

const app = express();

// Environment-based configuration
const isProduction = process.env.NODE_ENV === 'production';
const staticPath = isProduction
    ? path.join(__dirname, 'dist') // Change this if your static files are in a different directory
    : path.join(__dirname, 'products');

// CORS configuration
const corsOptions = {
    origin: isProduction
        ? 'https://myproject.com' // Replace with your actual frontend domain
        : 'http://localhost:4200',
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static assets
app.use(express.static(staticPath));

// API routes
app.use('/api/users', require('./users/user.controller'));
app.use('/branches', require('./branches/branch.controller'));
app.use('/warehouse', require('./warehouse/warehouse.controller'));
app.use('/sales', require('./sales/sales.controller'));
app.use('/orders', require('./orders/order.controller'));
app.use('/products', require('./products/product.controller'));
app.use('/inventory', require('./inventories/inventory.controller'));
app.use('/accounts', require('./accounts/account.controller'));
app.use('/api-docs', require('./_helpers/swagger'));

// Apply error handler middleware
app.use(errorHandler);

// Server port configuration
const port = isProduction ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));