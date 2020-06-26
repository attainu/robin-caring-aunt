import mongoose from 'mongoose';

const menstDtlSchema = new mongoose.Schema({
    pastPeriodDate: {
        type: Date,
        required: true
    },

    menstrualCycleLength: {
        type: Number,
        required: true,
        trim: true,
        min: 26,
        max: 30
    },

    periodLength: {
        type: Number,
        required: true,
        trim: true,
        min: 3,
        max: 8
    },

    notifyDate: {
        type: Date,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'User'
    }

});

menstDtlSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    userObject.pastPeriodDate =  userObject.pastPeriodDate.toDateString();
    delete userObject._id
    delete userObject.owner;
    delete userObject.notifyDate;
    delete userObject.__v;
    return userObject;
};

const Menstrual = mongoose.model('Menst', menstDtlSchema);
export default Menstrual;