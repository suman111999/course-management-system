const mongoose=require('mongoose');
const {MONGO_URI}=require('./index');

const connect=()=>{
    mongoose.connect(MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log(`successfully conneted to the database`)
    }).catch((error)=>{
        console.log(`err:${error}`);
        console.log(`connection failed`)
    })
};

module.exports=connect;