import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Hilfsfunktion zur sicheren Initialisierung von Stripe
const getStripe = () => {
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY ist nicht konfiguriert.");
  }
  return new Stripe(key, {
    apiVersion: "2023-10-16" as any,
  });
};

// Hilfsfunktion zur sicheren Initialisierung von Supabase
const getSupabaseAdmin = () => {
  const url = (process.env.VITE_SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) {
    throw new Error("Supabase Konfiguration fehlt.");
  }
  return createClient(url, key);
};

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure
    .input(z.object({ plan: z.enum(["monthly", "yearly"]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const stripe = getStripe();
        
        const rawPriceId = input.plan === "monthly" 
          ? process.env.STRIPE_PRICE_ID_MONTHLY 
          : process.env.STRIPE_PRICE_ID_YEARLY;
        
        const priceId = (rawPriceId || "").trim();

        if (!priceId) {
          throw new Error(`Stripe Price ID für ${input.plan} ist nicht konfiguriert.`);
        }

        const appUrl = (process.env.APP_URL || "https://tn-vault-main.vercel.app").trim();

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${appUrl}/verify?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/pricing`,
          customer_email: ctx.user.email,
          metadata: {
            userId: ctx.user.id,
          },
        });

        return { sessionId: session.id, url: session.url };
      } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        // Wir werfen den Fehler NICHT, sondern geben ihn als Objekt zurück,
        // um den "Unexpected token A" (HTML Error Page) zu vermeiden.
        return { 
          error: true, 
          message: error.message || "Ein interner Fehler ist aufgetreten.",
          details: error.stack || ""
        };
      }
    }),

  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("subscription_status")
        .eq("id", ctx.user.id)
        .single();

      if (error || !profile) {
        return { status: "none" };
      }

      return { status: profile.subscription_status };
    } catch (e) {
      console.error("Supabase Status Error:", e);
      return { status: "error" };
    }
  }),
});

export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  
  try {
    const stripe = getStripe();
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (userId) {
        const supabaseAdmin = getSupabaseAdmin();
        await supabaseAdmin
          .from("profiles")
          .update({ 
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string
          })
          .eq("id", userId);
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
