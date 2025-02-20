import { User } from './user.type.js';

export type Comment = {
  Comment: string;
  PostData: Date;
  Rating: number;
  Author: User;
}
