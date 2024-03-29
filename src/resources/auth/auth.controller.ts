import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { I18n } from 'nestjs-i18n/dist/decorators/i18n.decorator';
import { I18nContext } from 'nestjs-i18n/dist/i18n.context';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { LoginDto } from './dtos/request/login.dto';
import { ChangePasswordWithCodeDto } from './dtos/request/change-password-with-code.dto';
import { SignupDto } from './dtos/request/signup.dto';
import { AuthService } from './auth.service';
import { RefreshAccessTokenDto } from './dtos/request/refresh-access-token.dto';
import { AccessTokensDto } from './dtos/response/access-tokens.dto';
import { SendCodeDto } from './dtos/request/send-code.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dtos/request/change-password.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<AccessTokensDto>> {
    try {
      const response: ResponseDto<AccessTokensDto> =
        await this.authService.login(payload, i18n);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() payload: SignupDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.authService.signup(
        payload,
        i18n,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshCredentials(
    @Body() payload: RefreshAccessTokenDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<AccessTokensDto>> {
    try {
      const response: ResponseDto<AccessTokensDto> =
        await this.authService.refreshCredentials(payload, i18n);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('change-password-with-code')
  @HttpCode(HttpStatus.OK)
  async changePasswordWithCode(
    @Body() payload: ChangePasswordWithCodeDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> =
        await this.authService.changePasswordWithCode(payload, i18n);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('send-password-recovery-code')
  @HttpCode(HttpStatus.OK)
  async sendPasswordRecoveryCode(
    @Body() payload: SendCodeDto,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    try {
      const response: ResponseDto<object> = await this.authService.sendCode(
        payload,
        i18n,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() payload: ChangePasswordDto,
    @Req() req: any,
    @I18n() i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const jwtPayload: JwtPayload = req.user;

    try {
      const response: ResponseDto<object> =
        await this.authService.changePassword(payload, jwtPayload, i18n);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
