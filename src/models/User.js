import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  firebaseUid: { type: String, require: true, unique: true },
  username: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  profile: {
    type: String,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
  },
});
const User = model('User', UserSchema);

export default User;
