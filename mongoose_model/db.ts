import mongoose from "mongoose";

let url = 'mongodb://localhost:27017/Snippets';

if (process.env.DB_URL) {
    url = process.env.DB_URL;
}

mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
        if (!err) {
            console.log('MongoDB connection succeeded.');
        }
        else {
            console.error('Error in DB connection : ');
            console.error(err);
        }
    });

export default mongoose;