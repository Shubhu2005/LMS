// src/users/user.entity.ts
import { Role } from '../common/enums/role.enum';

export interface User {
  id: string;
  firstName: string;
  email: string;
  password: string; // hashed
  role: Role;
  createdAt: Date;
}