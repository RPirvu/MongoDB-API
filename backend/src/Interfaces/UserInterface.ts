export interface UserInterface {
    username: String;
    role: String;
    email: String;
    id: String;
}

export interface AppointmentInterface {
    userId: String,
    patientName: String,
    doctorId: String,
    doctorName: String,
    priceConsult: Number,
    priceIntervention: Number,
    appointmentType: String,
    date: String,
    status: String,
    aId: String
}

export interface AdminGetUserInterface {
    username: String;
    role: String;
    email: String;
    id: String;
}

export interface UserLoginInterface {
    username: String;
    password: String;
    id: String;
}

export interface CheckRoleInterface {
    username: String;
    role: String;
    email: String;
    id: String;
}

export interface DatabaseUserInterface {
    username: String;
    email: String;
    password: String;
    job: String;
    address: String;
    role: String;
    _id: String;
}