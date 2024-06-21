require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOption {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const sendMail = async (options: EmailOption): Promise<void> => {
    // Debugging environment variables
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_SERVICE:', process.env.SMTP_SERVICE);
    console.log('SMTP_MAIL:', process.env.SMTP_MAIL);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);

    // Check if essential environment variables are defined
    if (!process.env.SMTP_HOST || !process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
        throw new Error('Missing necessary environment variables for SMTP configuration.');
    }

    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;

    // Ensure the data object contains activationCode
    if (!data.activationCode) {
        throw new Error('Missing activationCode in the data object.');
    }

    // Get the path to the email template file
    const templatePath = path.join(__dirname, '../mails', template);
    
    // Render the email template with ejs
    const html: string = await ejs.renderFile(templatePath, data);
    
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;
