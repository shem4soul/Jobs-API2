require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')


// Connect DB & middleware
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// Routes
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// Error middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Trust proxy (for rate limiting)
app.set('trust proxy', 1);

// Rate limiting
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(xss());

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});



// Test route
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1> <a href="/api-docs">Documentation</a>');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
// require('dotenv').config();
// require('express-async-errors');

// const helmet = require('helmet')
// const cors = require('cors')
// const xss = require('xss-clean')
// const rateLimiter = require('express-rate-limit')



// const express = require('express');
// const app = express();

// //connectDB
// const connectDB = require('./db/connect')
// const authenticateUser = require('./middleware/authentication')

// //routers
// const authRouter = require('./routes/auth')
// const jobsRouter = require('./routes/jobs')

// // error handler
// const notFoundMiddleware = require('./middleware/not-found');
// const errorHandlerMiddleware = require('./middleware/error-handler');


// app.set('trust proxy', 1)
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, //15 minutes
//     max: 100, //limit each IP to 100 request per windowsMs

//   })
//   )
// app.use(express.json())
// app.use(helmet())
// app.use(cors())
// app.use(xss())




// app.use(express.json());
// // extra packages

// // routes
// app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/jobs', authenticateUser, jobsRouter)


// app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);

// const port = process.env.PORT || 3000;

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI)
  
    
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();
