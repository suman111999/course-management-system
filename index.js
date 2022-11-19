const express=require('express');
const {success,error}=require('consola');
const cors=require('cors');
const passport=require('passport');

const {PORT}=require('./config');//PORT is in config/index.js so no need to put index.js it automatically get from index.js
const connect=require('./config/connectDb');
const router=require('./routes/employeeRoutes');
const passportMiddleWare=require('./middlewares/passport')
const app=express();
connect();

app.use(cors())
app.use(express.json())
app.use(passport.initialize());
passportMiddleWare(passport);

app.use('/api',router);

app.listen(PORT,()=>{
success({message:`Server started on PORT ${PORT}`})
})