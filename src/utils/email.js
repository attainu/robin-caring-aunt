import nodeMailer from 'nodemailer';

const sendWelcomeEmail = async (email, name) => {

    const { USER_EMAIL, USER_EMAIL_PASSWORD } = process.env;
    console.log(USER_EMAIL);
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: USER_EMAIL,
            pass: USER_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: USER_EMAIL,
        to: email,
        subject: 'Thanks for joining Caring-Aunt',
        text: `Hii ${name}, from now onwards taking care of your menstrual cycle is our responsibility.`
    });
};

const sendCancellationEmail = (email, name) => {

    const resMsg = `Goodbye ${name}, Hope to see you soon.\nPlease do let us know, How we can improve!\nYou can send your feedback/suggestion at yourcaringaunt@gmail.com or simply reply to this email.\n\nRegards\nCaring Aunt Team`;
    const { USER_EMAIL, USER_EMAIL_PASSWORD } = process.env;
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: USER_EMAIL,
            pass: USER_EMAIL_PASSWORD
        }
    });
    transporter.sendMail({
        from: USER_EMAIL,
        to: email,
        subject: 'Sorry to see you go!',
        text: resMsg
    });
};

export default { sendWelcomeEmail, sendCancellationEmail };;

// let us know what we can do better 