const Menstrual = require('../models/menstrualModel');
const createNotifyDate = require('../utils/dateCalc');
const { check, validationResult } = require('express-validator');

const control = {

    create: async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            });
        }


        const date = req.body.pastPeriodDate;
        const length = req.body.menstrualCycleLength;
        req.body.notifyDate = createNotifyDate(date, length);

        const menstDtl = new Menstrual({
            ...req.body,
            owner: req.user._id
        });

        try {
            await menstDtl.save();
            res.status(201).send(menstDtl);
        } catch (e) {
            res.status(400).send();
        }
    },

    getData: async (req, res) => {

        try {
            const msnstDtl = await Menstrual.findOne({ owner: req.user._id });
            // Alternate methd > await req.user.populate('tasks').execPopulate()
            res.send(msnstDtl);
        } catch (e) {
            res.status(500).send();
        }
    },

    update: async (req, res) => {
        const updates = Object.keys(req.body);
        const canUpdate = ['pastPeriodDate', 'menstrualCycleLength', 'periodLength'];
        const isValidUpdate = updates.every(value => canUpdate.includes(value));

        if (!isValidUpdate) {
            return res.status(400).send({ error: 'Invalid updates' });
        }
        try {

            const menstDtl = await Menstrual.findOne({ owner: req.user._id });
            if (!menstDtl) {
                return res.status(404).send();
            }
            updates.forEach(update => menstDtl[update] = req.body[update]);

            if (req.body.pastPeriodDate && req.body.menstrualCycleLength) {
                var notifyDate = createNotifyDate(req.body.pastPeriodDate, req.body.menstrualCycleLength);
            } else if (req.body.pastPeriodDate) {
                var notifyDate = createNotifyDate(req.body.pastPeriodDate, menstDtl.menstrualCycleLength);
            } else if (req.body.menstrualCycleLength) {
                var notifyDate = createNotifyDate(menstDtl.pastPeriodDate, req.body.menstrualCycleLength);
            }

            menstDtl.notifyDate = notifyDate;
            await menstDtl.save();
            res.send(menstDtl);

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    remove: async (req, res) => {

        try {
            const menstDtl = await Task.findOneAndDelete({ owner: req.user._id });
            if (!menstDtl) {
                return res.status(404).send();
            }
            res.send({
                deletedData: menstDtl,
                result: "successfully deleted"
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }

};

module.exports = control;