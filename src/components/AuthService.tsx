import { createClient } from "@supabase/supabase-js";
import { User, LoginCredentials, RegisterData, RecoveryData } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

class AuthService {
  private currentUser: User | null = null;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  }

  private async loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        this.currentUser = {
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          country: data.country,
          residence: data.residence,
          createdAt: new Date(data.created_at),
        };
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }

  private generateRecoveryCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Login error:", error);
        return false;
      }

      if (data.user) {
        await this.loadUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async register(
    data: RegisterData
  ): Promise<{ success: boolean; recoveryCode?: string; error?: string }> {
    try {
      const recoveryCode = this.generateRecoveryCode();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            country: data.country,
            residence: data.residence,
            recovery_code: recoveryCode,
          },
        },
      });

      if (authError) {
        console.error("Auth registration error:", authError);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: data.email, // ✅ Must include email
            display_name: data.displayName,
            country: data.country,
            residence: data.residence,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          return { success: false, error: "Failed to create user profile" };
        }

        await this.loadUserProfile(authData.user.id);
        return { success: true, recoveryCode };
      }

      return { success: false, error: "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed. Please try again." };
    }
  }

  async recover(data: RecoveryData): Promise<boolean> {
    console.log("Recovery not yet implemented with Supabase");
    return false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      if (!this.currentUser) return false;

      const { error } = await supabase
        .from("users")
        .update({
          display_name: updates.displayName,
          country: updates.country,
          residence: updates.residence,
        })
        .eq("id", this.currentUser.id);

      if (error) {
        console.error("Profile update error:", error);
        return false;
      }

      this.currentUser = { ...this.currentUser, ...updates };
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.currentUser = null;
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
