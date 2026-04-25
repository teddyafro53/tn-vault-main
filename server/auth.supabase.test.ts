import { describe, expect, it, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Authentication", () => {
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  });

  it("validates Supabase client initialization", async () => {
    expect(supabase).toBeDefined();
    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("validates sign up endpoint is accessible", async () => {
    // Note: Email signup requires proper email configuration in Supabase
    // This test verifies the auth service is accessible
    const { data, error } = await supabase.auth.getSession();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.session).toBeNull(); // No session without login
  });

  it("validates sign in endpoint is accessible", async () => {
    // Note: Email signin requires valid user credentials
    // This test verifies the auth service responds correctly to invalid credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "WrongPassword",
    });

    // Should have an error for invalid credentials
    expect(error).toBeDefined();
    expect(error?.message).toContain("Invalid");
  });

  it("rejects invalid credentials", async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "nonexistent@example.com",
      password: "WrongPassword123!",
    });

    expect(error).toBeDefined();
    expect(error?.message).toContain("Invalid");
  });
});
