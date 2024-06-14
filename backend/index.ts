import express from 'express';
import router from './routes/auth';
import mongoose from 'mongoose';
 const app = express();

 const port = 3000;

import cors from'cors';


app.use(cors());
app.use(express.json());
app.use('/auth',router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('mongodb+srv://tarunkumar147800:q6GZUkFSCs0gm5Xs@cluster0.f4ulwwh.mongodb.net/',{ dbName:"Watch"});

