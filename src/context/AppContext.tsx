"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Chat {
  _id: string;
  users: string[];
  latestMessage: {
    text: string;
    sender: string;
  };
  createdAt: string;
  updatedAt: string;
  unseenCount?: number;
}

export interface Chats {
  _id: string;
  user: User;
  chat: Chat;
}

interface AppContextType {
  user: User | null;
  users: User[] | null;
  chats: Chats[] | null;
  loading: boolean;
  isAuth: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchChats: () => Promise<void>;
  setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chats[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);

  const fetchUser = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(`${user_service}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User logged out!");
  };

  const fetchChats = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(`${chat_service}/api/v1/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(data.chats);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const fetchUsers = async () => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.get(`${user_service}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchChats();
    fetchUsers();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loading,
        logoutUser,
        fetchChats,
        fetchUsers,
        chats,
        users,
        setChats,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useappdata must be used with AppProvider");
  return context;
};
