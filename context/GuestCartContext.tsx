"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface GuestCartContextType {
  sessionId: string;
  getSessionId: () => string;
}

const GuestCartContext = createContext<GuestCartContextType | undefined>(undefined);

export function GuestCartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>("");

  const getSessionId = () => {
    if (typeof window === "undefined") return "";
    
    let id = localStorage.getItem("guest-session-id");
    if (!id) {
      id = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guest-session-id", id);
    }
    return id;
  };

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return (
    <GuestCartContext.Provider value={{ sessionId, getSessionId }}>
      {children}
    </GuestCartContext.Provider>
  );
}

export function useGuestCart() {
  const context = useContext(GuestCartContext);
  if (context === undefined) {
    throw new Error("useGuestCart must be used within a GuestCartProvider");
  }
  return context;
}