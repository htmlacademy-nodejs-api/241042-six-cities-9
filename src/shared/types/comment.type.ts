import { User } from './user.type.js';

export type Comment = {
  comment: string;
  postData: Date;
  rating: number;
  author: User;
}
