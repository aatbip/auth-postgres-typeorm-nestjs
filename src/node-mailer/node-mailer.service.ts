import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";

@Injectable()
export class NodeMailerService {
  async sendMail(email: string, token: string) {
    try {

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "ressie.tromp@ethereal.email",
          pass: "62uge9j13jZpHv1pzV"
        }
      });

      let message = {
        from: "My Org <myorg@myorg.com>",
        to: email,
        subject: "Password Reset Code",
        text: `your code is ${token}`,
      }

      const info = await transporter.sendMail(message);
      return {
        message: "Code sent in email!",
        url: nodemailer.getTestMessageUrl(info)
      }
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: e.message,
      }, HttpStatus.FORBIDDEN, { cause: e })
    }

  }
}
