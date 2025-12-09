import React, {
  createContext,
  useContext,
  useState,
} from "react";

/**
 * @typedef {'user' | 'admin'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 * @property {string=} phone
 * @property {string=} address
 * @property {string=} detailAddress
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {(email: string, password: string) => Promise<boolean>} login
 * @property {(email: string, password: string, name: string, phone: string, address: string, detailAddress: string) => Promise<boolean>} register
 * @property {() => void} logout
 * @property {boolean} isAdmin
 * @property {boolean} isAuthenticated
 */

/** @type {React.Context<AuthContextType | undefined>} */
const AuthContext = createContext(undefined);

/** @type {User[]} */
const mockUsers = [
  {
    id: "admin-1",
    email: "admin@smartfarm.com",
    password: "admin123",
    name: "관리자",
    role: "admin",
  },
  {
    id: "user-1",
    email: "user@example.com",
    password: "user123",
    name: "홍길동",
    role: "user",
  },
];

/**
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  /** @type {[User|null, Function]} */
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  const login = async (email, password) => {
    const foundUser = mockUsers.find(
      (u) =>
        u.email === email &&
        u.password === password
    );

    if (foundUser) {
      const {
        password: _pw,
        ...userWithoutPassword
      } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "user",
        JSON.stringify(userWithoutPassword)
      );
      return true;
    }

    return false;
  };

  /**
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @param {string} phone
   * @param {string} address
   * @param {string} detailAddress
   * @returns {Promise<boolean>}
   */
  const register = async (
    email,
    password,
    name,
    phone,
    address,
    detailAddress
  ) => {
    const existingUser = mockUsers.find(
      (u) => u.email === email
    );
    if (existingUser) return false;

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: "user",
      phone,
      address,
      detailAddress,
    };

    mockUsers.push(newUser);

    const {
      password: _pw,
      ...userWithoutPassword
    } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(
      "user",
      JSON.stringify(userWithoutPassword)
    );

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }
  return context;
}
