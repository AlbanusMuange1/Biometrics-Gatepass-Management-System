const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const studentsRouter = require('./src/routes/students.route');
const staffRouter = require('./src/routes/staff.route');
const visitorRouter = require('./src/routes/visitors.route');
const uploadsRouter = require("./src/routes/uploads.route");
const entriesRouter = require("./src/routes/entries.route");

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb"
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

// app.use('/programming-languages', programmingLanguagesRouter);
app.use('/students', studentsRouter);
app.use('/staff', staffRouter);
app.use('/visitors', visitorRouter);
app.use('/entries', entriesRouter);

// For imagekit uploads
app.use('/upload/', uploadsRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({success: false, 'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`)
});
