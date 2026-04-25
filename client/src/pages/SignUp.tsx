import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUp() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

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
    if (msg.includes("already registered")) return "Diese E-Mail ist bereits registriert. Bitte melde dich an.";
    if (msg.includes("rate limit") || msg.includes("429")) return "Zu viele Versuche. Bitte warte kurz und versuche es erneut.";
    if (msg.includes("password") || msg.includes("Password")) return "Das Passwort muss mindestens 6 Zeichen lang sein.";
    if (msg.includes("email") || msg.includes("Email")) return "Bitte gib eine gültige E-Mail-Adresse ein.";
    return msg;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) { setError(getErrorMessage(signUpError.message)); return; }
      
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");

      if (data.session) {
        if (plan === "monthly" || plan === "yearly") {
          navigate(`/pricing`);
        } else {
          navigate("/dashboard");
        }
        return;
      }
      
      if (data.user && !data.session) {
        setNeedsConfirmation(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Konto erstellen</h1>
          <p className="text-slate-400 mb-6">Sichere deine wichtigen Dateien in der Cloud</p>
          {needsConfirmation && (
            <Alert className="mb-6 bg-green-900/20 border-green-700/50">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">Bestätigungsmail gesendet! Prüfe dein Postfach und klicke den Link.</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-700/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">E-Mail</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.com" required className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Passwort</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mindestens 6 Zeichen" required minLength={6} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg">
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Wird erstellt...</>) : ("Kostenlos registrieren")}
            </Button>
          </form>
          <p className="text-center text-slate-400 mt-6">
            Bereits ein Konto?{" "}
            <button onClick={() => navigate("/signin")} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Anmelden</button>
          </p>
        </div>
      </Card>
    </div>
  );
}
