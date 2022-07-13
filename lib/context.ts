import { createContext } from "react";
import { User } from "firebase/auth";

export const UserContext = createContext<{
  user: User | null| undefined;
  username: null | string;
}>({ user: null, username: null });
