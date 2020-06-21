const user_dtlCollection = require('../db').db().collection('user_dtl');
const ObjectID = require('mongodb').ObjectID;

let User_dtl = function (data, userid, phone_no) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.phone_no = phone_no;
};


User_dtl.prototype.cleanUp = function () {
  if (typeof (this.data.past_period_date) != 'string') { this.data.past_period_date = ''; }
  if (typeof (this.data.cycle_in_days) != 'string') { this.data.cycle_in_days = ''; }
  if (typeof (this.data.period_length) != 'string') { this.data.period_length = ''; }

  // get rid of non-related properties
  this.data = {
    past_period_date: this.data.past_period_date,
    cycle_in_days: this.data.cycle_in_days,
    period_length: this.data.period_length,
    user_id: ObjectID(this.userid),
    phone_no: this.phone_no
  };

  // Adding notify date to user_dtls data
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const dateArray = this.data.past_period_date.split('-');
  const intDateArray = dateArray.map(value => Number(value));

  const date = new Date(intDateArray[0], intDateArray[1] - 1, intDateArray[2]);
  const newDate = date.addDays(Number(this.data.cycle_in_days) - 1);
  const notifyDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;

  this.data.notifyDate = notifyDate;
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

User_dtl.viewHome = function () {
  return new Promise(async function (resolve, reject) {
    let userInfo = await user_dtlCollection.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userInformation'
        }
      },
      {
        $project: {
          past_period_date: 1,
          cycle_in_days: 1,
          period_length: 1,
          phone_no: 1,
          notifyDate: 1,
          user_id: { $arrayElemAt: ['$userInformation', 0] }
        }
      }
    ]).toArray();

    userInfo = userInfo.map((info) => {
      info.user_id = {
        username: info.user_id.username,
        email: info.user_id.email
      };
      return info;
    });
    if (userInfo.length) {
      console.log(userInfo);
      resolve(userInfo[3]);
    } else {
      reject();
    }
  });
};


module.exports = User_dtl;