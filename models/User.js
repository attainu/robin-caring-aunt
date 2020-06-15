const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users');
const validator = require('validator');

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof (this.data.username) != 'string') { this.data.username = ""; }
  if (typeof (this.data.email) != 'string') { this.data.email = ""; }
  if (typeof (this.data.password) != 'string') { this.data.password = ""; }

  // get rid of any non-related properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    phone_no: this.data.phone_no,
    password: this.data.password
  };
};

User.prototype.validate = function () {
  if (this.data.username == '') { this.errors.push('You must provide a USERNAME'); }
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) { this.errors.push("Username can only contain letters and numbers."); }
  if (!validator.isNumeric(this.data.phone_no)) { this.errors.push('Phone Number can only contain Numbers'); }
  if (!validator.isEmail(this.data.email)) { this.errors.push('You must provide a valid EMAIL ADDRESS'); }
  if (this.data.phone_no == '') { this.errors.push('You must provide a valid PHONE NUMBER'); }
  if (this.data.password == "") { this.errors.push("You must provide a password."); }
  if (this.data.password.length > 0 && this.data.password.length < 12) { this.errors.push("Password must be at least 12 characters."); }
  if (this.data.password.length > 50) { this.errors.push("Password cannot exceed 50 characters."); }
  if (this.data.username.length > 0 && this.data.username.length < 4) { this.errors.push('Username must be atleast 4 characters.'); }
  if (this.data.username.length > 30) { this.errors.push("Username cannot exceed 30 characters."); }
};

User.prototype.register = function () {
  this.cleanUp();
  this.validate();

  if (!this.errors.length) {
    // Hashing user password
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    usersCollection.insertOne(this.data);
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();

    usersCollection.findOne({ username: this.data.username }).then((attemptedUser) => {
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        resolve("Congrats!");
      } else {
        reject("Invalid username / password.");
      }
    }).catch(function () {
      reject("Please try again later.");
    });
  });
};

module.exports = User;