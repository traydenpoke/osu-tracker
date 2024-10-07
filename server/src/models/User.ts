import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: String,
		id: String,
		pp: Number,
	},
	{
		collection: 'users',
	}
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
