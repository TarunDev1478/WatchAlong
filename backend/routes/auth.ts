import express, { Router } from 'express';
import {z} from 'zod';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import {User} from "../db/db";
import { Rooms } from '../db/db';
import {authenticateJwt,SECRET} from '../middleware/authenticate';



const router=express.Router();

const signinput = z.object({
    username:z.string(),
    password:z.string()
})

router.use(cors());

router.post('/signup',async (req,res)=>{
    let parsedInput =  signinput.safeParse(req.body);
    if(!parsedInput.success){
        return res.json({
            error:"Wrong input",
        })
    }
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({username:req.body.username});
    if(user){
        res.json({
            message:"User With this username already exist"
        })
    }
    else{
        const newuser = new User({username,password});
        await newuser.save();
        const token=jwt.sign({id: newuser._id},SECRET, {expiresIn:'1h'});
        res.json({message:'user created successfully',token});
    }
});

router.post('/login', async (req,res)=>{
    const{ username , password}= req.body;
    const user = await User.findOne({username,password});
    if(user){
        const token = jwt.sign({id : user._id},SECRET,{expiresIn:'1h'});
        res.json({
            message:'User Logined Successfully',token
        })
    }
    else{
        res.json({
            message:"User Does not exist"
        })
    }
})

router.post('/addroom',authenticateJwt,async (req,res)=>{
    const {roomid ,url} =req.body;
    var owner;
    const id = req.headers['userId'];
    const user = await User.findOne({ _id: id });
    if(user){
        user.rooms=roomid;
        await user.save();
        owner=user._id;
        const newroom= new Rooms({Owner:owner,roomid:roomid,url:url});
        await newroom.save();
        res.json({message:'Room created successfully'});
    }else{
        res.json({message:'You are not authrised'})
    }
})
router.post('/closeroom',authenticateJwt,async (req,res)=>{
    const id = req.headers['userId'];
    const user = await User.findOne({ _id: id });
    if(user){
        await Rooms.deleteOne({roomid:user.rooms});
        user.rooms=null;
        user.save();
        res.json({message:'Room created successfully'});
    }else{
        res.json({message:'You are not authrised'})
    }
})

router.post('/update', authenticateJwt, async (req, res) => {
    try {
        const id = req.headers['userId'];
        const user = await User.findOne({ _id: id });
        if (user) {
            const { url } = req.body; 
            user.videolink = url;
            await user.save();
            return res.status(200).json({ message: 'Video link updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating video link:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/geturl', authenticateJwt, async (req, res) => {
    try {
        const id = req.headers["userId"];
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ videolink: user.videolink });
    } catch (error) {
      console.error('Error fetching URL:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


router.get('/getme',authenticateJwt,async (req,res)=>{
    const id = req.headers["userId"];
    const user =await User.findOne({_id:id});
    if(user){
        res.json({ username: user.username});
    }else{
        res.status(403).json({message:"User not autherised to acces this page"});
    }
})

export default router;
