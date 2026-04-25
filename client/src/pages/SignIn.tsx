import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignIn() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const getErrorMessage = (msg: string): string => {
    if (msg.includes("Invalid login")) return "E-Mail oder Passwort ist falsch.";
    if (msg.includes("rate limit") || msg.includes("429")) return "Zu viele Versuche. Bitte warte kurz.";
    if (msg.includes("Email not confirmed")) return "Bitte bestätige zuerst deine E-Mail (prüfe dein Postfach).";
    return msg;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(getErrorMessage(signInError.message)); return; }
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
          <p className="text-slate-400 mb-6">Melde dich an, um auf deinen Tresor zuzugreifen</p>
          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-700/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">E-Mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Passwort</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Dein Passwort" required className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Anmeldung...</>) : ("Anmelden")}
            </Button>
          </form>
          <p className="text-center text-slate-400 mt-6">
            Noch kein Konto?{" "}
            <button onClick={() => navigate("/signup")} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Registrieren</button>
          </p>
        </div>
      </Card>
    </div>
  );
}
