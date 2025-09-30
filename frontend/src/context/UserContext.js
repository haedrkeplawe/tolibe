import React, { createContext, useContext, useEffect, useState } from "react";

// خلينا نخلي القيمة الافتراضية null عشان نقدر نتحقق إذا ما انحط الـ Provider
const UserContext = createContext(null);

// Provider يلي بيحوي ال-state للـ username
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: "", username: "" }); // object يحتوي على id و username

  // أول مرة يشتغل الكومبوننت، نجيب user من localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // كل ما يتغير user نخزنه في localStorage
  useEffect(() => {
    if (user && user.username) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // لو صار فاضي نمسحه
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook عشان تسحب الـ context بسهولة
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx; // { user, setUser }
};
