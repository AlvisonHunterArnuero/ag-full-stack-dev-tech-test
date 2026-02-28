import jwt from 'jsonwebtoken';
import { authConfig } from './config';
import { AuthPayload } from '../types/user';

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, authConfig.jwt.secret) as AuthPayload;
};
