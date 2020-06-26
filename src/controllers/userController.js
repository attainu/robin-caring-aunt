import sharp from 'sharp';
import User from '../models/userModel';
import { check, validationResult } from 'express-validator';
import { sendWelcomeEmail, sendCancellationEmail } from '../utils/email';
import Menstrual from '../models/menstrualModel';
import dateCalc from '../utils/dateCalc'


const control = {

    signup: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({  // 422 -> Unprocessable Entity
                error: errors.array()[0].msg
            });
        }

        try {
            const user = new User(req.body);
            sendWelcomeEmail(user.email, user.name);

            await user.save();
            const token = await user.generateAuthToken();
            res.status(201).json({
                user,
                token,
                Result: 'Sign Up successfully'
            });
        } catch (e) {
            res.status(400).json({
                error: `Error: ${e}`
            });
        }
    },

    login: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            });
        }

        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();
            res.json({ 
                user,
                token,
                Result: 'Login Successfully'
            });
        } catch (e) {
            res.status(400).json({
                error: `Error: ${e}`
            });
        }
    },

    logout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((objToken) => {
                return objToken.token !== req.token; // [{id, token}, {id, token}..]
            });
            await req.user.save();
            res.status(200).json({
                Result: "Logout successfully"
            });
        } catch (e) {
            res.status(500).json({
                error: `Error: ${e}`
            });
        }
    },

    logoutAll: async (req, res) => {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.status(200).json({
                Result: "Logout successfully"
            });
        } catch (e) {
            res.status(500).json({
                error: `Error: ${e}`
            });
        }
    },

    userProfile: async (req, res) => {
        res.send(req.user);
    },

    updateUserProfile: async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age', 'contact'];
        const isvalidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isvalidOperation) {
            return res.status(400).send({ error: 'Invalid updates' });
        }
        try {
            /* certain mongoose query bypasses middleware (like findByIdAndUpdate())
            and perfoms operations directly on database and that is why we use special
            operation like runvalidator */
            updates.forEach(update => req.user[update] = req.body[update]);
            await req.user.save();
            res.json({
                profile: req.user,
                Result: 'Updated Successfully'

            });

        } catch (e) {
            res.status(400).json({   // validation failure
                error: `Error: ${e}`
            });
        }
    },

    deleteUserProfile: async (req, res) => {
        try {
            await req.user.remove(); //can also use findbyidanddelete
            sendCancellationEmail(req.user.email, req.user.name);
            res.json({
                profile: req.user,
                Result: 'Sign Out Successfully'
            });
        } catch (err) {
            res.status(500).json({
                error: `Error: ${e}`
            });
        }
    },

    uploadAvatar: async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.status(201).json({ Result: 'Profile pic uploaded Successfully' });
    },

    multerErrHandler: (err, req, res, next) => {
        res.status(400).send({ error: err.message });
    },

    deleteAvatar: async (req, res) => {
        if (!req.user.avatar) {
            return res.status(200).json({ msg: 'No profile pic found' });
        }
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).json({ Result: 'Profile pic removed Successfully' });
    },

    getAvatar: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);

            if (!user || !user.avatar) {
                return res.status(404).json({ error: 'Not Found' });
            }
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);

        } catch (e) {
            res.status(404).send();
        }
    },

    stats: async (req, res) => {
        try {
            const user = await Menstrual.findOne({ owner: req.user._id })
            const halfCycleLength = Math.round(user.menstrualCycleLength / 2)
            const ovulationDate = dateCalc(user.pastPeriodDate, halfCycleLength)
            res.status(200).json({
                'Currennt cycle start date': user.pastPeriodDate.toDateString(),
                'Current cycle end date': user.notifyDate.toDateString(),
                'Next cycle and period begins from': dateCalc(user.notifyDate, 2).toDateString(),
                'Ovulation phase': ovulationDate.toDateString()
            })
        } catch (e) {
            res.status(400).send(e)
        }   
    }
};

module.exports = control;