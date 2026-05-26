'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const CONTENT: Record<string, {
  title: string
  updated: string
  back: string
  sections: { title: string; content: string | string[] }[]
}> = {
  fr: {
    title: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour : 25 mai 2025',
    back: '← Retour',
    sections: [
      { title: '1. Acceptation', content: 'En accédant à Netral, vous acceptez ces conditions. Si vous n\'acceptez pas, vous ne devez pas utiliser le Service.' },
      { title: '2. Description du Service', content: 'Netral est un assistant IA incluant une application web, une extension VS Code et des API associées.' },
      { title: '3. Comptes utilisateurs', content: 'Vous devez créer un compte pour utiliser le Service. Vous êtes responsable de la confidentialité de vos identifiants. Âge minimum : 13 ans.' },
      { title: '4. Utilisation acceptable', content: ['Pas d\'activités illégales', 'Pas de contournement des limites ou mesures de sécurité', 'Pas de contenu nuisible, haineux ou trompeur', 'Pas de revente d\'accès sans autorisation', 'Pas de surcharge intentionnelle des serveurs', 'Pas de développement de produit concurrent'] },
      { title: '5. Abonnements', content: 'Certaines fonctionnalités nécessitent un abonnement payant. Les abonnements sont mensuels et non remboursables sauf disposition légale contraire.' },
      { title: '6. Propriété intellectuelle', content: 'Le contenu que vous générez vous appartient. Netral conserve tous les droits sur le Service, son code et sa marque.' },
      { title: '7. Limitation de responsabilité', content: 'Le Service est fourni "tel quel". Netral ne garantit pas l\'exactitude des réponses IA. Vous utilisez les résultats sous votre propre responsabilité.' },
      { title: '8. Résiliation', content: 'Nous pouvons suspendre votre compte en cas de violation. Vous pouvez supprimer votre compte à tout moment.' },
      { title: '9. Modifications', content: 'Nous pouvons modifier ces conditions à tout moment. L\'utilisation continue vaut acceptation.' },
      { title: '10. Contact', content: 'netral.ai.team@gmail.com' },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: May 25, 2025',
    back: '← Back',
    sections: [
      { title: '1. Acceptance', content: 'By accessing Netral, you agree to these terms. If you do not agree, you must not use the Service.' },
      { title: '2. Service description', content: 'Netral is an AI assistant including a web app, a VS Code extension, and associated APIs.' },
      { title: '3. User accounts', content: 'You must create an account to use the Service. You are responsible for the confidentiality of your credentials. Minimum age: 13.' },
      { title: '4. Acceptable use', content: ['No illegal activities', 'No circumventing limits or security measures', 'No harmful, hateful, or deceptive content', 'No reselling access without authorization', 'No intentional server overload', 'No developing competing products'] },
      { title: '5. Subscriptions', content: 'Some features require a paid subscription. Subscriptions are monthly and non-refundable except as required by law.' },
      { title: '6. Intellectual property', content: 'Content you generate belongs to you. Netral retains all rights to the Service, its code, and its brand.' },
      { title: '7. Limitation of liability', content: 'The Service is provided "as is". Netral does not guarantee the accuracy of AI responses. You use results at your own risk.' },
      { title: '8. Termination', content: 'We may suspend your account for violations. You may delete your account at any time.' },
      { title: '9. Changes', content: 'We may modify these terms at any time. Continued use constitutes acceptance.' },
      { title: '10. Contact', content: 'netral.ai.team@gmail.com' },
    ],
  },
  es: {
    title: 'Condiciones de uso',
    updated: 'Última actualización: 25 de mayo de 2025',
    back: '← Volver',
    sections: [
      { title: '1. Aceptación', content: 'Al acceder a Netral, aceptas estas condiciones. Si no las aceptas, no debes usar el Servicio.' },
      { title: '2. Descripción del Servicio', content: 'Netral es un asistente de IA que incluye una aplicación web, una extensión de VS Code y APIs asociadas.' },
      { title: '3. Cuentas de usuario', content: 'Debes crear una cuenta para usar el Servicio. Eres responsable de la confidencialidad de tus credenciales. Edad mínima: 13 años.' },
      { title: '4. Uso aceptable', content: ['Sin actividades ilegales', 'Sin eludir límites o medidas de seguridad', 'Sin contenido dañino, odioso o engañoso', 'Sin revender acceso sin autorización', 'Sin sobrecarga intencional de servidores', 'Sin desarrollar productos competidores'] },
      { title: '5. Suscripciones', content: 'Algunas funciones requieren suscripción de pago. Las suscripciones son mensuales y no reembolsables salvo disposición legal.' },
      { title: '6. Propiedad intelectual', content: 'El contenido que generas te pertenece. Netral conserva todos los derechos sobre el Servicio, su código y su marca.' },
      { title: '7. Limitación de responsabilidad', content: 'El Servicio se proporciona "tal cual". Netral no garantiza la exactitud de las respuestas de IA.' },
      { title: '8. Rescisión', content: 'Podemos suspender tu cuenta por infracciones. Puedes eliminar tu cuenta en cualquier momento.' },
      { title: '9. Modificaciones', content: 'Podemos modificar estas condiciones en cualquier momento. El uso continuado implica aceptación.' },
      { title: '10. Contacto', content: 'netral.ai.team@gmail.com' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: 25. Mai 2025',
    back: '← Zurück',
    sections: [
      { title: '1. Akzeptanz', content: 'Durch den Zugriff auf Netral stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen, dürfen Sie den Dienst nicht nutzen.' },
      { title: '2. Dienstbeschreibung', content: 'Netral ist ein KI-Assistent mit einer Web-App, einer VS Code-Erweiterung und zugehörigen APIs.' },
      { title: '3. Benutzerkonten', content: 'Sie müssen ein Konto erstellen, um den Dienst zu nutzen. Sie sind für die Vertraulichkeit Ihrer Anmeldedaten verantwortlich. Mindestalter: 13 Jahre.' },
      { title: '4. Akzeptable Nutzung', content: ['Keine illegalen Aktivitäten', 'Kein Umgehen von Limits oder Sicherheitsmaßnahmen', 'Keine schädlichen, hasserfüllten oder irreführenden Inhalte', 'Kein Weiterverkauf des Zugangs ohne Genehmigung', 'Keine absichtliche Serverüberlastung', 'Keine Entwicklung konkurrierender Produkte'] },
      { title: '5. Abonnements', content: 'Einige Funktionen erfordern ein kostenpflichtiges Abonnement. Abonnements sind monatlich und nicht erstattungsfähig.' },
      { title: '6. Geistiges Eigentum', content: 'Von Ihnen generierte Inhalte gehören Ihnen. Netral behält alle Rechte am Dienst, seinem Code und seiner Marke.' },
      { title: '7. Haftungsbeschränkung', content: 'Der Dienst wird "wie besehen" bereitgestellt. Netral garantiert nicht die Genauigkeit der KI-Antworten.' },
      { title: '8. Kündigung', content: 'Wir können Ihr Konto bei Verstößen sperren. Sie können Ihr Konto jederzeit löschen.' },
      { title: '9. Änderungen', content: 'Wir können diese Bedingungen jederzeit ändern. Die weitere Nutzung gilt als Zustimmung.' },
      { title: '10. Kontakt', content: 'netral.ai.team@gmail.com' },
    ],
  },
}

// Reuse English for languages not yet translated
const FALLBACK_LANGS = ['it', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'tr', 'nl', 'pl', 'uk']
FALLBACK_LANGS.forEach(lang => { if (!CONTENT[lang]) CONTENT[lang] = CONTENT.en })

export default function TermsPage() {
  const { locale } = useI18n()
  const c = CONTENT[locale] ?? CONTENT.en

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] py-20 px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] mb-8 inline-block">{c.back}</Link>
        <h1 className="text-[32px] font-bold tracking-tight mb-2">{c.title}</h1>
        <p className="text-[14px] text-[var(--fg-muted)] mb-10">{c.updated}</p>

        <div className="space-y-6 text-[14px] leading-[1.8] text-[var(--fg-soft)]">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">{s.title}</h2>
              {Array.isArray(s.content) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {s.content.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : (
                <p>{s.content}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
