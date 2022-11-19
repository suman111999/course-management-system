const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../config');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "employee",
        enum: ["employee", 'admin', 'superadmin']
    }

}, {
    timestamps: true
});

//to encrypt the password and save to db
//pre hooks->do something before saving
//before creating or saveing data in db, this would be called.
employeeSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next();
    }

    this.password=await bcrypt.hash(this.password,12);
    //12 is salt, higher the salt more securely encypted password
    next();
});

//comparing password
employeeSchema.methods.comparePassord=async function(password){
    return await bcrypt.compare(password,this.password);
};

employeeSchema.methods.generateJWT=async function(){
    let payload={
        username:this.username,
        email:this.email,
        role:this.role,
        id:this._id
    };

    return await sign(payload,SECRET,{expiresIn:"7 days"});
}

module.exports=  mongoose.model('employees',employeeSchema);