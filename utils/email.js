const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// Example usage
// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from = `MaterialChat <${process.env.EMAIL_FROM}>`;
  }

  // Create a transporter - use Sendgrid in prod or nodemailer in dev
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Use Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email

  async send(template, subject) {
    // 1.) Render HTML based on a pug template.
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      username: this.username,
      url: this.url,
      subject,
    });

    // 2.) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // TODO: install html-to-text for text conversion
      text: htmlToText.fromString(html),
    };

    // 3.) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to MaterialChat");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your temporary password reset token");
  }
};
