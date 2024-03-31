const nodeMailer = require("nodemailer");

const sendEmail =  async (options)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure: true,
        debug:true,
        secureConnection:false,
        logger:true,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD, // here "pass" here property we have to write in this format
        },
        tls:{
            rejectUnauthorized:true
        }
    });
    const mailOptions = {
        from :process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;