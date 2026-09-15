const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require('morgan')

app.use(morgan("dev"));

app.get('/', (req, res)=>{
    res.send('Hello World')
})


const PORT = 4000;

app.listen(PORT, ()=>{
    console.log("App is running on http://localhost:4000");
})