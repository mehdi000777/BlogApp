import mongoose from 'mongoose';

const URL = process.env.MONGODB_URL;

mongoose.connect(`${URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
    console.log("Mongodb connection");
})