const nodemailer = require('nodemailer');

class NodeMailer {
    constructor ({ user, pass }) {
        this.user = user;

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass }
        });
    }

    send = async ({ email, uuid }) => {
        const link = `http://192.168.1.217:3200/whiteboard/${uuid}/${email}`;
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Someone very special used Whiteboard ❤️ to send you this message:</h2>
                <blockquote style="margin: 20px 0; font-style: italic; color: #555;">
                    "Between pixels and lines on the screen,
                    it was you I wanted to remember.
                    Simple, sweet, just to say:
                    it's you I like to be with." ✨ 
                </blockquote>

                <p style="margin-top: 30px;">You can see the message by clicking the button below:</p>

                <a href="${link}" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #6C63FF;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                ">
                    View message on White Board 💜
                </a>
            </div>
        `;

        return this.transporter.sendMail({
            from: this.user,
            to: email,
            subject: 'A special message 💌',
            html
        })
    };
}

module.exports = {NodeMailer};