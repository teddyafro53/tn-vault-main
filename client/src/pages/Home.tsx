import { useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Cloud, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TN Vault
          </h1>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/pricing")} variant="ghost" className="text-slate-300 hover:bg-slate-800 hidden sm:inline-flex">
              Preise
            </Button>
            <Button onClick={() => navigate("/signin")} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Anmelden
            </Button>
            <Button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Kostenlos starten
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/50 rounded-full px-4 py-1.5 mb-6">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Server in der Schweiz</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Deine wichtigsten Dokumente.{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Immer dabei.
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Ausweis, Passfoto, Versicherung – alles sicher in der Cloud. Egal wo du bist: einfach einloggen und sofort Zugriff. Kein USB-Stick, keine Sorgen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                Jetzt kostenlos starten
              </Button>
              <Button onClick={() => navigate("/pricing")} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg">
                Preise ansehen
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            {[
              { icon: Lock, title: "Nur du hast Zugriff", description: "Deine Dateien sind verschlüsselt und privat – niemand sonst kann sie sehen" },
              { icon: Globe, title: "Von überall erreichbar", description: "Handy verloren? Im Ausland? Einfach in ein Internetcafé und einloggen" },
              { icon: Zap, title: "Schnell & einfach", description: "Hochladen in Sekunden. Kein technisches Wissen nötig" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6 rounded-lg hover:border-blue-700/50 transition-colors group">
                <div className="flex gap-4">
                  <feature.icon className="h-6 w-6 text-blue-400 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-bold text-white mb-12 text-center">So einfach geht's</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Registrieren", description: "E-Mail und Passwort – mehr brauchst du nicht" },
            { step: "2", title: "Hochladen", description: "Ziehe deine Dateien einfach ins Fenster oder klicke auf Upload" },
            { step: "3", title: "Zugreifen", description: "Von jedem Gerät einloggen und deine Dateien herunterladen" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 backdrop-blur-xl rounded-lg p-12 text-center">
          <Shield className="h-10 w-10 text-blue-400 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-3">Deine Daten gehören dir</h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Gehostet in der Schweiz. Kein Tracking. Keine Werbung. Jederzeit kündbar.</p>
          <Button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
            Kostenlos ausprobieren
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">&copy; 2026 TN Vault. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
              <button onClick={() => navigate("/impressum")} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Impressum</button>
              <button onClick={() => navigate("/datenschutz")} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Datenschutz</button>
              <button onClick={() => navigate("/pricing")} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Preise</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
