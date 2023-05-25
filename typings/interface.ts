import { Request } from "express"

export interface IPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface IRequest extends Request {
  user: IPayload
}
