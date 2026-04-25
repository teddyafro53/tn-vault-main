import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <nav className="border-b border-slate-700/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TN Vault</span>
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Kontakt</h2>
            <p>TN Vault<br />Tesfahun<br />Basel, Schweiz</p>
            <p className="mt-2">E-Mail: support@tnvault.ch</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Haftungsausschluss</h2>
            <p>Die Inhalte dieser Webseite wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Urheberrecht</h2>
            <p>Die durch den Betreiber dieser Seite erstellten Inhalte und Werke unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des Autors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
