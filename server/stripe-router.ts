import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure
    .input(z.object({ plan: z.enum(["monthly", "yearly"]) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
        if (!stripeSecretKey) {
          throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
        }

        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2023-10-16" as any,
        });

        const rawPriceId = input.plan === "monthly" 
          ? process.env.STRIPE_PRICE_ID_MONTHLY 
          : process.env.STRIPE_PRICE_ID_YEARLY;
        
        const priceId = (rawPriceId || "").trim();

        if (!priceId) {
          console.error("Stripe Error: Price ID not configured for plan:", input.plan);
          throw new Error(`Stripe Price ID for ${input.plan} not configured. Please check Vercel environment variables.`);
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
        console.error("Checkout Session Error:", error);
        throw new Error(error.message || "Failed to create checkout session");
      }
    }),

  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const supabaseUrl = (process.env.VITE_SUPABASE_URL || "").trim();
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("subscription_status")
      .eq("id", ctx.user.id)
      .single();

    if (error || !profile) {
      return { status: "none" };
    }

    return { status: profile.subscription_status };
  }),
});

// Webhook handler for Express
export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16" as any,
    });

    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const supabaseUrl = (process.env.VITE_SUPABASE_URL || "").trim();
      const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ 
          subscription_status: "active",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string
        })
        .eq("id", userId);
      
      if (error) {
        console.error("Error updating profile:", error);
      }
    }
  }

  res.json({ received: true });
};
