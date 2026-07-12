import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});


UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema);