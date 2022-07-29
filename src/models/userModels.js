const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		username: {
			type: String,
			unique: true,
			default: '',
			maxlength: 50,
			validate: {
				validator: function (v) {
					return v.length >= 6;
				},
				message: (props) => `Must be at least 6, got ${props.value.length}`,
			},
			required: [true, 'Username is required'],
		},
		email: {
			type: String,
			validate: {
				validator: function (v) {
					const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
					return regEmail.test(v);
				},
				message: () => 'Invalid email',
			},
			required: [true, 'Email is required'],

			unique: true,
		},
		password: {
			type: String,
			validate: {
				validator: function (v) {
					return v.length >= 6;
				},
				message: (props) => `Must be at least 6, got ${props.value.length}`,
			},
			required: [true, 'Password is required'],
		},
		role: { type: String, default: 'init' },
		isActive: { type: Boolean, default: false }, //false until
		phone: { type: String, default: '' },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Model', User, 'user');
