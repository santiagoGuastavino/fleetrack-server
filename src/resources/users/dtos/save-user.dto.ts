export class SaveUserDto {
  email: string;
  password: string;
  passwordRecoveryCode: number;

  constructor(email: string, password: string, passwordRecoveryCode: number) {
    this.email = email;
    this.password = password;
    this.passwordRecoveryCode = passwordRecoveryCode;
  }
}
