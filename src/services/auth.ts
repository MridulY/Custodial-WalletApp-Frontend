import { UserData } from "../types";

const API_URL = "https://custodial-walletapp-backend-1.onrender.com/api";

class AuthService {
  private user: UserData | null = null;

  constructor() {
    // Initialize user from stored token
    const token = this.getToken();
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<UserData> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    this.user = data.user;
    return data.user;
  }

  async login(email: string, password: string): Promise<UserData> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    this.user = data.user;
    return data.user;
  }

  async verifyToken(): Promise<UserData | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      this.user = data.user;
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
    localStorage.removeItem("transactions");
    this.user = null;
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  getCurrentUser(): UserData | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.user;
  }
}

export const authService = new AuthService();
