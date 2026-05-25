import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] mb-8 inline-block">← Retour</Link>
        <h1 className="text-[32px] font-bold tracking-tight mb-2">Politique de confidentialité</h1>
        <p className="text-[14px] text-[var(--fg-muted)] mb-10">Dernière mise à jour : 25 mai 2025</p>

        <div className="space-y-6 text-[14px] leading-[1.8] text-[var(--fg-soft)]">
          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Données collectées</h2>
            <p>Nous collectons uniquement les données nécessaires au fonctionnement du Service :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[var(--fg)]">Compte :</strong> nom, email, mot de passe (hashé)</li>
              <li><strong className="text-[var(--fg)]">Conversations :</strong> messages échangés avec l&apos;IA</li>
              <li><strong className="text-[var(--fg)]">Usage :</strong> nombre de messages, plan, dates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Fournir et améliorer le Service</li>
              <li>Gérer votre compte et votre abonnement</li>
              <li>Assurer la sécurité du Service</li>
            </ul>
            <p className="mt-2">Nous ne vendons jamais vos données à des tiers.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Stockage et sécurité</h2>
            <p>Vos données sont stockées sur des serveurs sécurisés. Les mots de passe sont hashés avec bcrypt. Les communications sont chiffrées via HTTPS/TLS.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Accès à vos données personnelles</li>
              <li>Rectification de vos données</li>
              <li>Suppression de votre compte et données</li>
              <li>Portabilité de vos données</li>
              <li>Opposition au traitement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Cookies</h2>
            <p>Nous utilisons un cookie de session (httpOnly, secure) pour l&apos;authentification. Aucun cookie de tracking ou publicitaire n&apos;est utilisé.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">Contact</h2>
            <p>Pour exercer vos droits ou poser une question :</p>
            <p className="mt-2"><strong className="text-[var(--fg)]">Email :</strong> netral.ai.team@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
