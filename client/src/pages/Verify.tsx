import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Loader2, CheckCircle } from "lucide-react";

export default function Verify() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/signin");
      return;
    }

    const verifySubscription = async () => {
      // Poll for subscription status update (max 5 attempts)
      let attempts = 0;
      const maxAttempts = 5;
      
      const check = async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        if (profile?.subscription_status === "active") {
          navigate("/dashboard");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, 2000); // Wait 2 seconds and try again
        } else {
          // If still not active after polling, go to pricing to show status
          navigate("/pricing");
        }
      };

      check();
    };

    verifySubscription();
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-8 rounded-2xl max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            <CheckCircle className="h-8 w-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Zahlung wird verifiziert</h1>
        <p className="text-slate-400">
          Einen Moment bitte, wir schalten deinen Tresor gerade frei...
        </p>
      </div>
    </div>
  );
}
