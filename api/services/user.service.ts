import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { ErrorHandler } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";

export interface IUserService {
  hashPassword(password: IUser["password"]): Promise<IUser["password"]>;
  generateToken(user: IUser): string;
  login(user: IUser): Promise<string>;
}

export class UserService implements IUserService {
  private jwtSecretKey: string | undefined;

  constructor(protected repository: IUserRepository) {
    this.jwtSecretKey = process.env.JWT_SECRET;
  }

  public async hashPassword(
    password: IUser["password"]
  ): Promise<IUser["password"]> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public generateToken(user: IUser): string {
    if (!this.jwtSecretKey) {
      throw new Error("Please add your JWT_SECRET to .env");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, stripeCustomerId: user.stripeCustomerId },
      this.jwtSecretKey,
      {
        expiresIn: "30d",
      }
    );
    return token;
  }

  public async login(user: IUser): Promise<string> {
    const userFound = await this.repository.login(user);
    if (!userFound) {
      throw new ErrorHandler("User not found", StatusCodes.NOT_FOUND);
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      userFound.password
    );
    if (!isPasswordCorrect) {
      throw new ErrorHandler("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const token = this.generateToken(userFound);
    return token;
  }
}
