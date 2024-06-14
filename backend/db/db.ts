import mongoose from  'mongoose';

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    videolink:String,
    rooms:String
})

const rooms= new mongoose.Schema({
    Owner:String,
    roomid:String,
    url:String,
})

export const User = mongoose.model('User',UserSchema);
export const Rooms = mongoose.model('Room',rooms);