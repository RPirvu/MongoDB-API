import mongoose, { Error } from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './User';

import Appointment from './Appointment';
import { AdminGetUserInterface, CheckRoleInterface, UserLoginInterface, DatabaseUserInterface, UserInterface } from './Interfaces/UserInterface';


/************************************************************************************************************************************/
/********************************************************CONNECT TO DB***************************************************************/
/************************************************************************************************************************************/
dotenv.config();
mongoose.connect("mongodb+srv://robert:S123456A@cluster0.dmafe.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err : Error) =>{ 
    if(err) throw err;
        console.log("Connected To Mongo")
    
});


/************************************************************************************************************************************/
/**********************************************************MIDDLEWARES***************************************************************/
/************************************************************************************************************************************/
const app = express();
app.use(express.json());
app.use(cors({origin: "http://localhost:3000", credentials: true}));
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const isAdministratorMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const { user } : any = req;
    if (user) {
        User.findOne({ username: user.username }, (err, doc: CheckRoleInterface) => {
            if (err) throw err;
            if (doc?.role === 'Admin') {
                next();
            }
            else{
                res.send("Sorry, only administrators cand perform this");  
            }   
        })
    }
    else{
        res.send("Sorry, you arent logged in")
    }
}
const isSecretaryMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const { user } : any = req;
    if (user) {
        User.findOne({ username: user.username }, (err, doc: CheckRoleInterface) => {
            if (err) throw err;
            if (doc?.role === 'Secretary') {
                next();
            }
            else{
                res.send("Sorry, only secretaries cand perform this");  
            }   
        })
    }
    else{
        res.send("Sorry, you arent logged in")
    }
}
const isDoctorMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const { user } : any = req;
    if (user) {
        User.findOne({ username: user.username }, (err, doc: CheckRoleInterface) => {
            if (err) throw err;
            if (doc?.role === 'Doctor') {
                next();
            }
            else{
                res.send("Sorry, only doctors cand perform this");  
            }   
        })
    }
    else{
        res.send("Sorry, you arent logged in")
    }
}


/************************************************************************************************************************************/
/*************************************************************PASSPORT***************************************************************/
/************************************************************************************************************************************/
const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user: any) => {
        if(err) throw err;
        if(!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true){
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
})
);

passport.serializeUser((user : any, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id : string, cb) => {
    User.findOne({ _id: id }, (err, user : any ) => {
        const userInformation = {
            username: user.username,
            role: user.role,
            id: user._id,
            email: user.email
            
        };
        cb(err, userInformation);
    });
});


/************************************************************************************************************************************/
/***************************************************************ROUTES***************************************************************/
/************************************************************************************************************************************/

//UNRESTRICTED ROUTES
app.post('/register', async (req, res) =>{
    const { username, password } = req?.body;
    if ( !username || !password || typeof username !=="string" || typeof password !=="string") {
        res.send("Improper Values");
        return;
    }
    User.findOne({ username }, async (err: Error, doc) => {
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({  
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            phone: req.body.phone,
            full_name: req.body.full_name,
            blood_type: req.body.blood_type,
            job: req.body.job,
            address: req.body.address,
            cabinet: req.body.cabinet
        });
        await newUser.save();
        res.send("success");
        }
    })  
});
app.post("/login", passport.authenticate("local"), (req, res) => {
    res.send("success");
});
app.get("/logout",(req, res) => {
    req.logout();
    res.send("success")
})

//User's ROUTES
app.get("/user", (req, res) => {
    res.send(req.user);
  });
app.post('/newappointment', async (req, res) =>{
    const { userId, appointmentType, status } = req?.body;
    if ( !userId || typeof userId !=="string" || !appointmentType || typeof appointmentType !=="string" ) {
        res.send("Improper Values");
        return;
    } 
    //check if appointment exists 
    Appointment.findOne({ userId, appointmentType, status!:'Accepted'||'Pending' }, async (err: Error, doc) => {
        if (err) throw err;
        // if appointment exists
        if (doc) res.send("Appointment Already Exists!");
        // if appointment does't exists
        if (!doc) {
            const newAppointment = new Appointment({
                userId: req.body.userId,
                patientName: req.body.patientName,
                doctorId: req.body.doctorId,
                doctorName:req.body.doctorName,
                appointmentType: req.body.appointmentType,
                date: req.body.date,
                priceConsult:req.body.priceConsult,
                priceIntervention:req.body.priceIntervention,
                ustensils:req.body.ustensils,                      
                status: req.body.status,
                aId: mongoose.Types.ObjectId()
        });
        await newAppointment.save();
        res.send('success');
        }
    })  
});
app.put("/updateinfo", async(req, res) => {
    await User.findByIdAndUpdate(req.body._id, req.body, { new: true, useFindAndModify: false})
    res.send("success")
})
app.put("/updatepassword", async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    req.body.password = hashedPassword;
    await User.findByIdAndUpdate(req.body._id, req.body, { new: true, useFindAndModify: false})
    res.send("success")
})

//Admin's ROUTES  
app.post("/deleteuser",isAdministratorMiddleware, async  (req, res) => {
    const { id } = req.body
    await User.findByIdAndDelete(id, (err: Error) => {
        if (err) throw err;
    });
    res.send("success")
})
app.get("/getallusers", isAdministratorMiddleware, async (req, res) => {
    await User.find({}, (err: Error, data: AdminGetUserInterface[]) => {
        if (err) throw err;
        const filteredUsers : any = [];
        data.forEach((item : any) => {
            const userInformation = {
                id: item._id,
                username: item.username,
                role: item.role
            }
            filteredUsers.push(userInformation);
        })
        res.send(filteredUsers);
    })
})
app.post('/makeaccount',isAdministratorMiddleware, async (req, res) =>{
    const { username, password } = req?.body;
    if ( !username || !password || typeof username !=="string" || typeof password !=="string") {
        res.send("Improper Values");
        return;
    }
    User.findOne({ username }, async (err: Error, doc) => {
        if (err) throw err;
        if (doc) res.send("User Already Exists");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({  
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            phone: req.body.phone,
            full_name: req.body.full_name,
            blood_type: req.body.blood_type,
            job: req.body.job,
            address: req.body.address,
            cabinet: req.body.cabinet
        });
        await newUser.save();
        res.send("success");
        }
    })  
});

//Secretary's ROUTES
app.get("/getallappointments",isSecretaryMiddleware, async (req, res) => {
    await Appointment.find({}, (err: Error, data: any[]) => {
        if (err) throw err;
        const filteredAppointments : any = [];
        data.forEach((item : any) => {
            const appointmentInformation = {
                userId: item.userId,
                doctorId: item.doctorId,
                appointmentType: item.appointmentType,
                date: item.date,
                status: item.status,
                aId: item.aId
            }
            filteredAppointments.push(appointmentInformation);
        })
        res.send(filteredAppointments);
    })
})

//Doctor's ROUTES
app.get("/getdoctorsappointments",isDoctorMiddleware, async (req, res) => {
    const { doctorId } = req?.body;
    await Appointment.find({doctorId}, (err: Error, data: any[]) => {
        if (err) throw err;
        const filteredAppointments : any = [];
        data.forEach((item : any) => {
            const appointmentInformation = {
                userId: item.userId,
                doctorId: item.doctorId,
                appointmentType: item.appointmentType,
                date: item.date,
                status: item.status,
                aId: item.aId
            }
            filteredAppointments.push(appointmentInformation);
        })
        res.send(filteredAppointments);
    })
})
app.put("/updateappointment", async(req, res) => {
    await Appointment.findByIdAndUpdate(req.body._id, req.body, { new: true, useFindAndModify: false})
    res.send("success")
})

//Start Server
app.listen(4000, () => {
    console.log("Server Started")
})