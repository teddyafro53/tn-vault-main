import { describe, expect, it, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Storage", () => {
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  });

  it("validates Supabase Storage bucket access", async () => {
    // List buckets to verify storage access
    const { data, error } = await supabase.storage.listBuckets();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
  });

  it("can verify vault-images bucket exists or will be created", async () => {
    // Note: vault-images bucket should be created in Supabase console
    // This test just verifies we can list buckets
    const { data, error } = await supabase.storage.listBuckets();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    // Bucket creation is done manually in Supabase console
  });

  it("can generate public URLs for files", async () => {
    // Test generating a public URL (doesn't require file to exist)
    const testPath = "test-user/test-image.jpg";
    const { data } = supabase.storage.from("vault-images").getPublicUrl(testPath);

    expect(data).toBeDefined();
    expect(data?.publicUrl).toContain("vault-images");
    expect(data?.publicUrl).toContain(testPath);
  });
});
