import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] mb-8 inline-block">← Retour</Link>
        <h1 className="text-[32px] font-bold tracking-tight mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-[14px] text-[var(--fg-muted)] mb-10">Dernière mise à jour : 25 mai 2025</p>

        <div className="prose prose-sm text-[var(--fg-soft)] space-y-6 text-[14px] leading-[1.8]">
          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">1. Acceptation des conditions</h2>
            <p>En accédant à Netral (le &quot;Service&quot;), vous acceptez d&apos;être lié par ces conditions d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser le Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">2. Description du Service</h2>
            <p>Netral est un assistant IA qui fournit des réponses basées sur l&apos;intelligence artificielle. Le Service inclut une application web, une extension VS Code (Netral Code), et des API associées.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">3. Comptes utilisateurs</h2>
            <p>Vous devez créer un compte pour utiliser le Service. Vous êtes responsable de la confidentialité de vos identifiants. Vous devez avoir au moins 13 ans pour utiliser le Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">4. Utilisation acceptable</h2>
            <p>Vous vous engagez à ne pas :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Utiliser le Service pour des activités illégales</li>
              <li>Tenter de contourner les limites d&apos;utilisation ou les mesures de sécurité</li>
              <li>Générer du contenu nuisible, haineux ou trompeur</li>
              <li>Revendre ou redistribuer l&apos;accès au Service sans autorisation</li>
              <li>Surcharger intentionnellement les serveurs (DDoS, spam)</li>
              <li>Utiliser le Service pour développer un produit concurrent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">5. Abonnements et paiements</h2>
            <p>Certaines fonctionnalités nécessitent un abonnement payant. Les prix sont indiqués sur la page Tarifs. Les abonnements sont mensuels et non remboursables sauf disposition légale contraire.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">6. Propriété intellectuelle</h2>
            <p>Le contenu que vous générez via le Service vous appartient. Netral conserve tous les droits sur le Service, son code source, son design et sa marque. Vous nous accordez une licence limitée pour traiter vos données afin de fournir le Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">7. Données personnelles</h2>
            <p>Nous collectons et traitons vos données conformément à notre politique de confidentialité. Vos conversations peuvent être utilisées pour améliorer le Service de manière anonymisée. Vous pouvez demander la suppression de vos données à tout moment.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">8. Limitation de responsabilité</h2>
            <p>Le Service est fourni &quot;tel quel&quot;. Netral ne garantit pas l&apos;exactitude, la complétude ou la fiabilité des réponses générées par l&apos;IA. Vous utilisez les résultats sous votre propre responsabilité. Netral ne saurait être tenu responsable de dommages indirects résultant de l&apos;utilisation du Service.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">9. Suspension et résiliation</h2>
            <p>Nous nous réservons le droit de suspendre ou résilier votre compte en cas de violation de ces conditions, sans préavis. Vous pouvez supprimer votre compte à tout moment.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">10. Modifications</h2>
            <p>Nous pouvons modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication. L&apos;utilisation continue du Service après modification vaut acceptation.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">11. Contact</h2>
            <p>Pour toute question concernant ces conditions :</p>
            <p className="mt-2"><strong className="text-[var(--fg)]">Email :</strong> netral.ai.team@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
