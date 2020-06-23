const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'k.negi791@gmail.com',
    from: 'whoisnegi07@gmail.com', 
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail.send(msg)
    .then(here => console.log(here))    
    .catch(e => console.log(e))