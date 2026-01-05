import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
type IUserEmail = {
  email?: string;
  fullName?: string;
};

export default class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;
  private otp: string;
  constructor(user: IUserEmail, url?: string, otp?: string) {
    this.to = user.email || '';
    this.firstName = user.fullName?.split(' ')[0] || '';
    this.url = url || '';
    this.otp = otp || '';
    this.from = `Domique Fusion <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      logger: true, // bật log
      debug: true,
    } as SMTPTransport.Options);
  }

  async send(templateEmail: string, subject: string): Promise<void> {
    const layoutPath = path.join(__dirname, '../views/emails/layouts/main.hbs');
    const contentPath = path.join(
      __dirname,
      `../views/emails/templateMails/${templateEmail}.hbs`,
    );

    const stylePartial = fs.readFileSync(
      path.join(__dirname, '../views/emails/partials/style.hbs'),
      'utf8',
    );

    Handlebars.registerPartial('style', stylePartial);
    const layout = fs.readFileSync(layoutPath, 'utf8');
    const content = fs.readFileSync(contentPath, 'utf8');

    const template = Handlebars.compile(layout);

    const html = template({
      subject,
      body: Handlebars.compile(content)({
        name: this.firstName,
        url: this.url,
        otp: this.otp,
        expireMinutes: 15,
      }),
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: subject,
      html,
    };

    try {
      await this.newTransport().sendMail(mailOptions);
      console.log('✅ Email sent');
    } catch (err) {
      console.error('❌ Email send failed:', err);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Domique Fusion!');
  }

  async sendOTP() {
    await this.send('sendOTP', 'Your OTP register (valid for only 5 minutes)');
  }
}
