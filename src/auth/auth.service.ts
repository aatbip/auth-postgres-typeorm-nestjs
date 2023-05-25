import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/resetPassword-dto';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private nodeMailerService: NodeMailerService,
    @InjectRepository(Token) private readonly Token: Repository<Token>
  ) { }

  async register(createUserDto: CreateUserDto) {

    return this.userService.create(createUserDto);

  }

  async signIn(email: string, password: string) {
    let isUser = await this.userService.findByEmail(email);

    if (!isUser) {
      throw new ForbiddenException("Email not registered!")
    }

    const isMatch = await this.userService.isMatch(email, password);

    if (!isMatch) {
      throw new UnauthorizedException("Password Didn't match!")
    }

    const payload = { sub: isUser.uuid, email: isUser.email };

    return {
      access_token: await this.jwtService.signAsync(payload)
    }

  }

  async forgotPassword(email: string) {

    let isUser = await this.userService.findByEmail(email);

    if (!isUser) {
      throw new ForbiddenException("Email not registered!")
    }

    let rand = Math.random().toString(36).substring(2, 8);

    let token: Token = new Token();

    token.email = email;
    token.token = rand;

    await this.Token.save(token);

    return this.nodeMailerService.sendMail(email, rand);

  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {

    const isToken = await this.Token.findOne({
      where: {
        token: resetPasswordDto.token
      }
    })


    if (!isToken) {
      throw new ForbiddenException("Invalid Token!")
    }

    const user = await this.userService.findByEmail(isToken.email);


    if (!user) {
      throw new ForbiddenException("Invalid Token!")
    }

    await this.userService.resetPassword(resetPasswordDto.newPassword, isToken.email);


    return {
      msg: "Password has been changed!"
    }

  }

}
















