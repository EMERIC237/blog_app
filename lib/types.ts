import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
export interface firebaseUser extends User {}
export interface PostModel {
  title: string;
  slug: string;
  uid: string;
  username: string;
  published: boolean;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  heartCount: number;
}

export interface UserModel {
  displayName: string;
  username: string;
  photoURL: string;
}
