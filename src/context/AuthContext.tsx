import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  income?: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setIncome: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('spendsmartUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      
      const mockUsers = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
      const userExists = mockUsers.some((u: any) => u.id === JSON.parse(savedUser).id);
      
      if (!userExists) {
        const userData = JSON.parse(savedUser);
        mockUsers.push({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          income: userData.income || 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        localStorage.setItem('spendsmartUsers', JSON.stringify(mockUsers));
        console.log("Added missing user to spendsmartUsers:", userData);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const mockUsers = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
    const foundUser = mockUsers.find(
      (u: { email: string; password: string }) => 
      u.email === email && u.password === password
    );
    
    if (foundUser) {
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        income: foundUser.income
      };
      
      setUser(authenticatedUser);
      setIsLoggedIn(true);
      localStorage.setItem('spendsmartUser', JSON.stringify(authenticatedUser));
      
      const userExists = mockUsers.some((u: any) => u.id === foundUser.id);
      if (!userExists) {
        mockUsers.push({
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          password: password,
          income: foundUser.income || 0,
          createdAt: foundUser.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
        localStorage.setItem('spendsmartUsers', JSON.stringify(mockUsers));
      } else {
        const updatedUsers = mockUsers.map((u: any) => 
          u.id === foundUser.id ? { ...u, lastLogin: new Date().toISOString() } : u
        );
        localStorage.setItem('spendsmartUsers', JSON.stringify(updatedUsers));
      }
      
      const userLogins = JSON.parse(localStorage.getItem('userLogins') || '[]');
      userLogins.push({
        userId: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        date: new Date().toISOString()
      });
      localStorage.setItem('userLogins', JSON.stringify(userLogins));
      
      return Promise.resolve();
    } else {
      const userExists = mockUsers.some((u: { email: string }) => u.email === email);
      
      if (userExists) {
        const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
        failedAttempts.push({
          email,
          date: new Date().toISOString()
        });
        localStorage.setItem('failedLoginAttempts', JSON.stringify(failedAttempts));
        
        return Promise.reject(new Error('Invalid credentials'));
      }
      
      const storedUser = localStorage.getItem(`user-${email}`);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.password === password) {
          const newUserId = `user-${Date.now()}`;
          const newUser = {
            id: newUserId,
            name: userData.name || email.split('@')[0],
            email: email,
            password: password,
            income: userData.income || 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          mockUsers.push(newUser);
          localStorage.setItem('spendsmartUsers', JSON.stringify(mockUsers));
          
          const authenticatedUser = {
            id: newUserId,
            name: newUser.name,
            email: newUser.email,
            income: newUser.income
          };
          
          setUser(authenticatedUser);
          setIsLoggedIn(true);
          localStorage.setItem('spendsmartUser', JSON.stringify(authenticatedUser));
          
          const userLogins = JSON.parse(localStorage.getItem('userLogins') || '[]');
          userLogins.push({
            userId: newUserId,
            name: newUser.name,
            email: newUser.email,
            date: new Date().toISOString()
          });
          localStorage.setItem('userLogins', JSON.stringify(userLogins));
          
          console.log("Recovered user and added to spendsmartUsers:", newUser);
          return Promise.resolve();
        }
      }
      
      const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
      failedAttempts.push({
        email,
        date: new Date().toISOString()
      });
      localStorage.setItem('failedLoginAttempts', JSON.stringify(failedAttempts));
      
      return Promise.reject(new Error('Invalid credentials'));
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const mockUsers = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
    const userExists = mockUsers.some((u: { email: string }) => u.email === email);
    
    if (userExists) {
      return Promise.reject(new Error('User already exists'));
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      income: 0,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    localStorage.setItem('spendsmartUsers', JSON.stringify(mockUsers));
    
    const authenticatedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      income: newUser.income
    };
    
    setUser(authenticatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('spendsmartUser', JSON.stringify(authenticatedUser));
    
    const userLogins = JSON.parse(localStorage.getItem('userLogins') || '[]');
    userLogins.push({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      date: new Date().toISOString()
    });
    localStorage.setItem('userLogins', JSON.stringify(userLogins));
    
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('spendsmartUser');
  };

  const setIncome = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, income: amount };
      setUser(updatedUser);
      localStorage.setItem('spendsmartUser', JSON.stringify(updatedUser));
      
      const mockUsers = JSON.parse(localStorage.getItem('spendsmartUsers') || '[]');
      const updatedUsers = mockUsers.map((u: { id: string }) => 
        u.id === user.id ? { ...u, income: amount } : u
      );
      localStorage.setItem('spendsmartUsers', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, setIncome }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
