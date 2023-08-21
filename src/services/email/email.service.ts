import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import { IUser } from 'src/model/interfaces/user.interface';

type AuthEmailType = 'password-recovery' | 'signup';
class AuthEmailData {
  subject: string;
  textRequest: string;
  textAction: string;
  code: number;
}

@Injectable()
export class EmailService {
  private recipient: string;
  private emailData: AuthEmailData;
  private template: AuthEmailType;

  public async sendAuthEmail(user: IUser, type: AuthEmailType) {
    this.recipient = user.email;

    const emailData = new AuthEmailData();

    switch (type) {
      case 'signup':
        emailData.subject = 'Account created';
        emailData.textRequest = 'You have successfully created a new account.';
        this.template = 'signup';
        break;
      case 'password-recovery':
        emailData.code = user.passwordRecoveryCode;
        emailData.subject = 'Password reset code';
        emailData.textRequest = 'You have requested to set a new password.';
        emailData.textAction = 'Please, use the following code to do so.';
        this.template = 'password-recovery';
        break;
    }

    this.emailData = emailData;
    await this.sendEmail();
  }

  private async sendEmail(): Promise<void> {
    const template = fs.readFileSync(
      `${__dirname}/templates/${this.template}.template.html`,
      'utf-8',
    );
    const compiledTemplate = handlebars.compile(template);

    const smtpTransport = createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `fleetrack<${process.env.MAIL_FROM}>`,
      to: this.recipient.toLowerCase(),
      subject: this.emailData.subject,
      html: compiledTemplate(this.emailData),
    };

    await smtpTransport.sendMail(mailOptions);
  }
}
