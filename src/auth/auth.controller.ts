import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/resetPassword-dto';
import { SignInDto } from './dto/signin-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post()
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('forgotpassword/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Patch('resetpassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

}
