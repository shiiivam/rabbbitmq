const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routeURL = require('./routes/routes.js')

dotenv.config()
app.use(express.json());
mongoose.connect(process.env.DB_STRING,{ useNewUrlParser: true, useUnifiedTopology: true  },()=>{
    console.log('Database connected');
})

app.use('/',routeURL)

const port = process.env.PORT || 4000
app.listen(port,console.log(`Listening on port ${port}`));