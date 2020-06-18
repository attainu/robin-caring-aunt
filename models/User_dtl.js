const user_dtlCollection = require('../db').db().collection('user_dtl');
const ObjectID = require('mongodb').ObjectID; // Good Practice to store id as ObjectId

let User_dtl = function (data, userid) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

User_dtl.prototype.cleanUp = function () {
  if (typeof (this.data.past_period_date) != 'string') { this.data.past_period_date = ''; }
  if (typeof (this.data.cycle_in_days) != 'string') { this.data.cycle_in_days = ''; }
  if (typeof (this.data.period_length) != 'string') { this.data.period_length = ''; }

  // get rid of bogus properties
  this.data = {
    past_period_date: this.data.past_period_date,
    cycle_in_days: this.data.cycle_in_days,
    period_length: this.data.period_length,
    user_id: ObjectID(this.userid)
  };
};

User_dtl.prototype.validate = function () {
  if (this.data.past_period_date == '') { this.errors.push('You must provide a date in \'DD-MM-YYYY\' format'); }
  if (this.data.cycle_in_days == '') { this.errors.push('You must provide your period cycle in days, Average Cycle : 28Days '); }
  if (this.data.period_length == '') { this.errors.push('You must provide a length of you period, Normally it last 4 Days'); }
};

User_dtl.prototype.details = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      // Save the details linked with User_Id
      user_dtlCollection.insertOne(this.data)
        .then(() => {
          resolve();
        }).catch(() => {
          this.errors.push('NOT able to save details in DB');
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

module.exports = User_dtl;