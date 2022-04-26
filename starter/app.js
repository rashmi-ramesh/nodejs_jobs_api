require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const connectDB = require('./db/connect')
const authentication = require('./middleware/authentication'); //verifies jwt token
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// express rate limit
app.set('trust proxy',1) //for deployment in aws,heroku etc
app.use(rateLimiter({
  windowMs:15*60*1000, //window milliseconds, basically time is 15mins here
  max:100 //how many requests
}));

app.use(express.json());

// extra packages for security reasons
app.use(helmet()); 
app.use(cors());//makes apis to be accessed by diff domains
app.use(xss());//cross side scripting - prevents from injecting malicious code 


// routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authentication,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
