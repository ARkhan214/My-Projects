const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');




const app = express();
const PORT = 3100;

app.use(cors());
app.use(bodyParser.json());


const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

app.use("/api/countries", require("./routes/countryRoutes"));


app.use("/api/divisions", require("./routes/divisionRoutes"));


app.use("/api/districts", require("./routes/districtRoutes"));
app.use("/api/policestations", require("./routes/policeStationRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));




app.get('/', (req, res)=>{

    // res.send('<p>Welcome to Node JS</p>'); 

    res.sendFile(path.join(__dirname, 'public', 'index.html'));

});













app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});







