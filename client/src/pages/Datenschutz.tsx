import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
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
        <h1 className="text-3xl font-bold text-white mb-8">Datenschutzerklärung</h1>
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">1. Allgemeines</h2>
            <p>Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschliesslich auf Grundlage des schweizerischen Datenschutzgesetzes (DSG) und der Datenschutz-Grundverordnung (DSGVO).</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">2. Verantwortlicher</h2>
            <p>TN Vault, Tesfahun, Basel, Schweiz<br />E-Mail: support@tnvault.ch</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">3. Erhobene Daten</h2>
            <p>Bei der Nutzung unseres Dienstes erheben wir folgende Daten:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li>E-Mail-Adresse (für die Registrierung und Anmeldung)</li>
              <li>Hochgeladene Dateien (Bilder und Dokumente)</li>
              <li>Nutzungsdaten (Zeitpunkt der Anmeldung, Speicherverbrauch)</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">4. Zweck der Datenverarbeitung</h2>
            <p>Ihre Daten werden ausschliesslich zur Bereitstellung unseres Cloud-Speicherdienstes verwendet. Wir verkaufen oder teilen Ihre Daten nicht mit Dritten.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">5. Speicherung</h2>
            <p>Ihre Daten werden auf sicheren Servern in Europa (Zürich, Schweiz) gespeichert. Die Speicherung erfolgt so lange, wie Ihr Konto aktiv ist. Nach Löschung Ihres Kontos werden alle Daten innerhalb von 30 Tagen endgültig gelöscht.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">6. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter support@tnvault.ch.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">7. Cookies</h2>
            <p>Wir verwenden nur technisch notwendige Cookies für die Authentifizierung. Es werden keine Tracking-Cookies oder Cookies von Drittanbietern eingesetzt.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
