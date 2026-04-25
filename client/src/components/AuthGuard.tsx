import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function AuthGuard({ children, requireSubscription = false }: AuthGuardProps) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const [, navigate] = useLocation();
  const [subscriptionLoading, setSubscriptionLoading] = useState(requireSubscription);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/signin");
      return;
    }

    if (requireSubscription) {
      const checkSubscription = async () => {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("subscription_status")
          .eq("id", user.id)
          .single();

        if (error || !profile || profile.subscription_status !== "active") {
          navigate("/pricing");
        } else {
          setHasSubscription(true);
        }
        setSubscriptionLoading(false);
      };

      checkSubscription();
    }
  }, [user, authLoading, requireSubscription, navigate]);

  if (authLoading || (requireSubscription && subscriptionLoading)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;
  if (requireSubscription && !hasSubscription) return null;

  return <>{children}</>;
}
