const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

//remove all of these routes and then make a new one that will call all the endpoints in the form of middleware and parallel requests will be called together

//routes
const  summary  = require('./routes/summaryRoutes');





//custom middlewares
const checkIndustry = require('./middleWares/checkIndustry');
const addsummary = require('./middleWares/addSummary');
const addQueries = require('./middleWares/addQueries')
const queriesRank = require('./controllers/queryRanksContorller');
const { topTen } = require('./middleWares/topTen')
app.use(checkIndustry);
app.use(addsummary);
app.use(addQueries);
app.use(queriesRank);
app.use(topTen);
//endPoints
app.use('/api/summary',  summary);














app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ error: 'Internal server error from app' });
});

module.exports = app;


