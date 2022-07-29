const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const { sendFailMessage } = require('../utils');
dotenv.config();

const verifyToken = (req, res, next) => {
	const token = req.headers['authorization']?.split(' ')?.[1];

	if (!token) {
		return res.status(403).send('A token is required for authentication');
	}
	try {
		const decoded = jwt.verify(token, config.TOKEN_KEY);
		req.user = decoded;
	} catch (err) {
		return res.status(401).send('Invalid Token');
	}
};

const verifyUser = (req, res, next) => {
	const received = req.body;

	UserModel.findOne({ username: received.username })
		.then((data) => {
			if (!data) {
				res.status(404).json(sendFailMessage('User not found'));
			}
			if (data) {
				bcrypt.compare(
					received.password,
					data.password,
					function (err, result) {
						console.log('result :', result);
						if (result) {
							res.locals.tokenPayload = {
								username: data.username,
								password: data.password,
								role: data.role,
								isActive: data.isActive,
								updatedAt: data.updatedAt,
							};
							next();
						} else {
							res.status(201).json(sendFailMessage('Password incorrect'));
						}
					}
				);
			}
		})
		.catch((e) => {
			res.status(201).json(sendFailMessage('Password incorrect', e));
		});
};

function validateUsername(req, res, next) {
	const { username } = req.body;
	const usernameRegex = /^[a-zA-Z0-9]+$/;
	const iUsernameValid = usernameRegex.test(username);
	if (!iUsernameValid)
		res.status(201).send(sendFailMessage('Username is not valid !'));
	if (iUsernameValid) next();
}

function verifyTokenResetPw(req, res, next) {
	const received = req.body;
	const token = received.token;
	if (!token) res.status(401).send(sendFailMessage('Token invalid'));
	jwt.verify(token, process.env.FPW_TOKEN_JWT_KEY, (err, data) => {
		if (err) {
			console.log('err :', err);
			res.status(201).send(sendFailMessage('Token invalid!', err));
		}
		if (data) {
			console.log('data :', data);
			res.locals.username = data.username;
			next();
		}
	});
}

module.exports = {
	verifyToken,
	verifyUser,
	validateUsername,
	verifyTokenResetPw,
};
