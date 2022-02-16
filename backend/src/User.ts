import mongoose from 'mongoose';

const user = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password:{
        type:String
    },
    role: {
        type: String,
        enum : ['Patient','Admin','Doctor','Secretary'],
        default: 'Patient'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone:{
        type: String,
        default: '07xx-xxx-xxx'
    },
    full_name:{
        type: String,
    },
    blood_type:{
        type: String,
        enum: ['O I','A II','B III','AB IV','undefined'],
        default: 'undefined'
    },
    job: {
       type: String,
       default: "undefined"
    },
    address: {
        type: String,
        default: "undefined"
    },
    cabinet:{
        type: String,
        default: "undefined"
    }
});


export default mongoose.model("User", user);