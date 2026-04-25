# TN Vault - Produktionsreife & Paywall-Dokumentation

Das Projekt wurde erfolgreich von einer Demo-Version in eine produktionsreife SaaS-Plattform transformiert. Alle Kernfunktionen für den Bezahl-Flow und die Zugriffskontrolle sind implementiert.

## 🚀 Erledigte Arbeiten

1.  **Strikte Paywall:**
    *   Ein `AuthGuard` wurde implementiert, der den Zugriff auf Dashboard, Upload und Galerie nur für Nutzer mit aktivem Abo erlaubt.
    *   Nicht zahlende Nutzer werden automatisch zur Preisübersicht (`/pricing`) weitergeleitet.
2.  **Stripe-Integration:**
    *   `stripe-router.ts` erstellt für Checkout-Sessions (Monatlich & Jährlich).
    *   Stripe-Webhook-Handler für die automatische Freischaltung nach Zahlung integriert.
3.  **Abo-Optionen:**
    *   **Monatlich:** 3.99 CHF
    *   **Jährlich:** 29.99 CHF (37% Ersparnis)
4.  **Datenbank-Erweiterung:**
    *   `PROFILES_SETUP.sql` erstellt für die Speicherung des Abo-Status in Supabase.
5.  **UI/UX Polishing:**
    *   Deutsche Fehlermeldungen und Erfolgs-Toasts integriert.
    *   Automatischer Redirect nach Registrierung zum Bezahl-Flow.

## 🛠 Nächste Schritte (Manuelle Konfiguration)

Da die Vercel-Tokens aus dem Protokoll nicht mehr gültig waren, müssen folgende Schritte manuell im Vercel- und Supabase-Dashboard durchgeführt werden:

### 1. Supabase SQL Editor
Führe den Inhalt der Datei `PROFILES_SETUP.sql` im SQL-Editor von Supabase aus. Dies erstellt die Profil-Tabelle und den automatischen Trigger für neue Nutzer.

### 2. Vercel Umgebungsvariablen
Setze folgende Variablen in deinem Vercel-Projekt:
*   `STRIPE_SECRET_KEY`: Dein Stripe Secret Key (sk_live_...)
*   `STRIPE_WEBHOOK_SECRET`: Dein Stripe Webhook Secret (whsec_...)
*   `STRIPE_PRICE_ID_MONTHLY`: `price_1TNbtMRq1hQSPnhe9Z6vorWR` (oder neu erstellt)
*   `STRIPE_PRICE_ID_YEARLY`: (Erstelle ein jährliches Produkt in Stripe und füge die ID hier ein)
*   `APP_URL`: `https://deine-domain.com` (oder die Vercel-URL)
*   `VITE_SUPABASE_URL`: Deine Supabase URL
*   `VITE_SUPABASE_ANON_KEY`: Dein Supabase Anon Key

### 3. Stripe Webhook
Registriere die URL `https://deine-app.vercel.app/api/stripe-webhook` in deinem Stripe-Dashboard und abonniere das Event `checkout.session.completed`.

## 📦 Deployment
Das Projekt ist so konfiguriert, dass es mit `pnpm build` sowohl das Frontend als auch den API-Server für Vercel Serverless Functions baut.

**TN Vault ist nun bereit für echte Kunden!**
