// USER.MJS
import MONGOOSE from 'mongoose';

// 1. Define the Schema
const USER_SCHEMA = new MONGOOSE.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// 2. Create the Model
const USER = MONGOOSE.model('User', USER_SCHEMA);

// 3. Export the Model using ES module syntax
export default USER;
