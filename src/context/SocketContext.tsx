import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

// HARDCODED FLAG TO DISABLE SOCKETS TEMPORARILY
const DISABLE_SOCKETS = false;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (DISABLE_SOCKETS) return;

    const token = localStorage.getItem("accessToken");
    if (user && token) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const serverUrl = apiUrl.replace("/api/v1", "");

      const socketInstance = io(serverUrl, {
        auth: { token },
        withCredentials: true,
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
