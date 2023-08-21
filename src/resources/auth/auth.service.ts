import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResponseDto, ResponseMessage } from 'src/common/dtos/response.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { LoginDto } from './dtos/request/login.dto';
import { UsersService } from '../users/users.service';
import { IUser } from 'src/model/interfaces/user.interface';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { I18nContext } from 'nestjs-i18n';
import { WrongPasswordException } from 'src/resources/auth/exceptions/wrong-password.exception';
import { SignupDto } from './dtos/request/signup.dto';
import { AccessTokensDto } from './dtos/response/access-tokens.dto';
import { AlreadyExistsException } from 'src/common/exceptions/already-exists.exception';
import { SaveUserDto } from '../users/dtos/save-user.dto';
import { EmailService } from 'src/services/email/email.service';
import { RefreshAccessTokenDto } from './dtos/request/refresh-access-token.dto';
import { CredentialsExpiredException } from './exceptions/credentials-expired.exception';
import { ObjectId } from 'mongodb';
import { WrongCodeException } from './exceptions/wrong-code.exception';
import { ChangePasswordWithCodeDto } from './dtos/request/change-password-with-code.dto';
import { SamePasswordException } from './exceptions/same-password.exception';
import { SendCodeDto } from './dtos/request/send-code.dto';
import { FilterQuery } from 'mongoose';
import { User } from 'src/model/schemas/user.schema';
import { ChangePasswordDto } from './dtos/request/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  public async login(
    payload: LoginDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<AccessTokensDto>> {
    const response = new ResponseDto<AccessTokensDto>(
      HttpStatus.OK,
      ResponseMessage.OK,
    );

    const userToLogin: IUser = await this.usersService.findOne({
      email: payload.email,
    });

    if (!userToLogin) throw new NotFoundException(i18n, 'user');

    const passwordsMatch = await this.matchPasswords(
      payload.password,
      userToLogin.password,
    );

    if (!passwordsMatch) throw new WrongPasswordException(i18n);

    const accessTokensDto: AccessTokensDto =
      await this.generateTokens(userToLogin);

    response.payload = accessTokensDto;

    return response;
  }

  public async signup(
    payload: SignupDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<AccessTokensDto>> {
    const response = new ResponseDto<AccessTokensDto>(
      HttpStatus.CREATED,
      ResponseMessage.CREATED,
    );

    const userExists: IUser = await this.usersService.findOne({
      email: payload.email,
    });

    if (userExists) throw new AlreadyExistsException(i18n, 'email');

    const hashedPassword: string = await this.hashPassword(payload.password);

    const newUser = new SaveUserDto(
      payload.email,
      hashedPassword,
      this.generateRandomNumber(),
    );

    const savedUser: IUser = await this.usersService.insertAndReturn(newUser);

    await this.emailService.sendAuthEmail(savedUser, 'signup');
    const accessTokensDto: AccessTokensDto =
      await this.generateTokens(savedUser);

    response.payload = accessTokensDto;

    return response;
  }

  public async refreshCredentials(
    payload: RefreshAccessTokenDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<AccessTokensDto>> {
    const response = new ResponseDto<AccessTokensDto>(
      HttpStatus.OK,
      ResponseMessage.CREATED,
    );

    const refresh_token: string = payload.refresh_token;

    const decodedJwtPayload: JwtPayload =
      await this.decodeJwtPayload(refresh_token);

    const userId: ObjectId = decodedJwtPayload._id;
    const timestamp: number = decodedJwtPayload.timestamp;
    const now: number = new Date().getTime();

    const userToRenewCredentials: IUser = await this.usersService.findOne({
      _id: userId,
    });

    if (!userToRenewCredentials) throw new NotFoundException(i18n, 'user');

    if (userToRenewCredentials.lastRefreshToken !== timestamp)
      throw new CredentialsExpiredException(i18n);

    if (this.refreshTokenExpired(timestamp, now))
      throw new CredentialsExpiredException(i18n);

    await this.usersService.updateOneAndReturn(
      { _id: userToRenewCredentials._id },
      { lastRefreshToken: now },
    );

    const newCredentials: JwtPayload = {
      _id: userToRenewCredentials._id,
    };

    const accessToken: string = this.generateAccessToken(newCredentials);
    const refreshToken: string = this.generateRefreshToken(newCredentials, now);

    const responsePayload: AccessTokensDto = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    response.payload = responsePayload;

    return response;
  }

  public async changePasswordWithCode(
    payload: ChangePasswordWithCodeDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const userToRenewPassword: IUser = await this.usersService.findOne({
      email: payload.email,
    });

    if (!userToRenewPassword) throw new NotFoundException(i18n, 'user');
    if (userToRenewPassword.passwordRecoveryCode !== Number(payload.code))
      throw new WrongCodeException(i18n, 'passwordRecoveryCode');

    const passwordsMatch: boolean = await this.matchPasswords(
      payload.password,
      userToRenewPassword.password,
    );

    if (passwordsMatch) throw new SamePasswordException(i18n);

    const hashedPassword: string = await this.hashPassword(payload.password);

    const newCode = this.generateRandomNumber();

    await this.usersService.updateOneAndReturn(
      { _id: userToRenewPassword._id },
      {
        password: hashedPassword,
        passwordRecoveryCode: newCode,
      },
    );

    return response;
  }

  public async sendCode(
    payload: SendCodeDto,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const userRequiringCode: IUser = await this.usersService.findOne({
      email: payload.email,
    });

    if (!userRequiringCode) throw new NotFoundException(i18n, 'user');

    const newCode: number = this.generateRandomNumber();
    const update: FilterQuery<User> = {};
    update.passwordRecoveryCode = newCode;

    const updatedUser: IUser = await this.usersService.updateOneAndReturn(
      { _id: userRequiringCode._id },
      update,
    );

    await this.emailService.sendAuthEmail(updatedUser, 'password-recovery');

    return response;
  }

  public async changePassword(
    payload: ChangePasswordDto,
    jwtPayload: JwtPayload,
    i18n: I18nContext,
  ): Promise<ResponseDto<object>> {
    const response = new ResponseDto<object>(HttpStatus.OK, ResponseMessage.OK);

    const userToChangePassword: IUser = await this.usersService.findOne({
      _id: jwtPayload._id,
    });

    const passwordsMatch: boolean = await this.matchPasswords(
      payload.password,
      userToChangePassword.password,
    );

    if (passwordsMatch) throw new SamePasswordException(i18n);

    const hashedPassword: string = await this.hashPassword(payload.password);
    const newCode: number = this.generateRandomNumber();

    await this.usersService.updateOneAndReturn(
      { _id: userToChangePassword._id },
      {
        password: hashedPassword,
        passwordRecoveryCode: newCode,
      },
    );

    return response;
  }

  private generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async matchPasswords(
    payloadPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(payloadPassword, userPassword);
  }

  private async generateTokens(user: IUser): Promise<AccessTokensDto> {
    const jwtPayload: JwtPayload = {
      _id: user._id,
    };

    const now: number = new Date().getTime();

    const accessToken: string = this.generateAccessToken(jwtPayload);
    const refreshToken: string = this.generateRefreshToken(jwtPayload, now);

    await this.usersService.updateOneAndReturn(
      { _id: user._id },
      { lastRefreshToken: now },
    );

    const accessTokensDto: AccessTokensDto = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    return accessTokensDto;
  }

  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_TIME,
    });
  }

  private generateRefreshToken(payload: JwtPayload, timestamp: number): string {
    return this.jwtService.sign(
      { ...payload, timestamp },
      {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_TIME,
      },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async decodeJwtPayload(refreshToken: string): Promise<JwtPayload> {
    const decoded = this.jwtService.decode(refreshToken) as JwtPayload;
    return decoded;
  }

  private refreshTokenExpired(timestamp: number, now: number): boolean {
    const diffTime: number = Math.abs(timestamp - now);
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const expireAfterDays: number = parseInt(
      process.env.JWT_REFRESH_TOKEN_TIME.match(/\d+/)[0],
    );

    return diffDays > expireAfterDays;
  }
}
