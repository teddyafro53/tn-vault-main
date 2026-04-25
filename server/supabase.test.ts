import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Configuration", () => {
  it("validates Supabase credentials and connectivity", async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseAnonKey).toBeDefined();

    // Create a client with the provided credentials
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

    // Test basic connectivity by attempting to get auth status
    const { data, error } = await supabase.auth.getSession();

    // Should not throw an error - just validate the connection works
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
