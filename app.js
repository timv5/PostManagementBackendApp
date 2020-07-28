const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/post');
const postNumberRoutes = require('./routes/postnumber');
const rateRoutes = require('./routes/rate');
const jobCategoryRoutes = require('./routes/jobcategory');
const dateControlRoutes = require('./routes/dateControl');

// seed database endpoint
const seedDatabaseRoutes = require('./seedDatabase/seedDatabaseRouter');

const app = express();

//connect app to the mongodb with mongoose
const databaseConnection = '';
mongoose.connect(databaseConnection, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.log('Connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// we grant access to images for requests going to images
app.use('/images', express.static(path.join('images/images')));

//server config to run service on different port than client
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //which domain we can access
    //in comming request my have different headers
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    );
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/post", postsRoutes);
app.use("/api/postnumber", postNumberRoutes);
app.use("/api/rate/", rateRoutes);
app.use("/api/jobcategory", jobCategoryRoutes);
app.use("/api/datecontrol", dateControlRoutes);

app.use("/api/seed/", seedDatabaseRoutes);

module.exports = app;
