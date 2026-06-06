'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const CONTENT: Record<string, {
  title: string
  updated: string
  back: string
  intro: string
  sections: { title: string; content: string | string[] }[]
  contactLabel: string
  contactEmail: string
}> = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    updated: 'Dernière mise à jour : 6 juin 2026',
    back: '← Retour',
    intro: "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme Netral (ci-après « le Service »), éditée par Netral, accessible via le site netral.app et ses applications associées (extension VS Code, API). En utilisant le Service, vous acceptez sans réserve les présentes CGU.",
    contactLabel: 'Contact',
    sections: [
      {
        title: '1. Définitions',
        content: [
          'Service : l\'ensemble des fonctionnalités proposées par Netral, incluant l\'assistant IA conversationnel, l\'extension VS Code, les intégrations tierces et les API.',
          'Utilisateur : toute personne physique majeure ou mineure de plus de 13 ans disposant de l\'autorisation parentale, qui accède au Service.',
          'Contenu : toute donnée, texte, code, image ou information transmise par l\'Utilisateur ou générée par le Service.',
          'IA générative : modèle d\'intelligence artificielle produisant des réponses à partir des requêtes de l\'Utilisateur.',
          'Mémoire contextuelle : fonctionnalité permettant au Service de conserver des préférences et informations fournies par l\'Utilisateur pour améliorer la pertinence des réponses.',
        ],
      },
      {
        title: '2. Objet et description du Service',
        content: [
          'Netral est une plateforme d\'intelligence artificielle conversationnelle multimodèle intégrant :',
          '— Un assistant IA avec recherche web en temps réel, citations de sources et mémoire contextuelle persistante.',
          '— Une extension VS Code native permettant l\'édition, la génération et la correction de code assistées par IA.',
          '— Des intégrations avec les services Google (Gmail, Calendar, Drive) via OAuth 2.0.',
          '— Une API REST permettant aux développeurs d\'intégrer les capacités de Netral dans leurs propres applications.',
          'Le Service est proposé en plusieurs plans tarifaires (Free, Pro, Enterprise) dont les caractéristiques sont détaillées sur la page /tarifs.',
        ],
      },
      {
        title: '3. Accès et inscription',
        content: [
          'L\'accès au Service nécessite la création d\'un compte utilisateur via une adresse email valide ou l\'authentification Google OAuth.',
          'L\'Utilisateur s\'engage à fournir des informations exactes, complètes et à jour lors de son inscription. Toute fausse déclaration pourra entraîner la suspension du compte.',
          'L\'Utilisateur est responsable du maintien de la confidentialité de ses identifiants de connexion. Toute utilisation du compte via ces identifiants est réputée effectuée par l\'Utilisateur.',
          'Âge minimum requis : 13 ans. Les mineurs de moins de 16 ans doivent obtenir le consentement de leurs parents.',
          'Netral se réserve le droit de refuser l\'accès au Service à toute personne ne respectant pas les présentes CGU.',
        ],
      },
      {
        title: '4. Utilisation acceptable',
        content: [
          'L\'Utilisateur s\'engage à ne pas utiliser le Service pour :',
          '— Toute activité illégale, frauduleuse ou portant atteinte aux droits des tiers.',
          '— Générer, diffuser ou stocker du contenu illicite, haineux, discriminatoire, violent, pornographique, ou incitant à la haine ou à la violence.',
          '— Contourner les limitations techniques, les quotas d\'utilisation ou les mesures de sécurité du Service.',
          '— Tenter de rétro-concevoir, décompiler ou extraire le code source du Service.',
          '— Utiliser des robots, scrapers ou tout moyen automatisé non autorisé pour accéder au Service.',
          '— Surcharger ou perturber intentionnellement l\'infrastructure du Service (DDoS, brute-force, etc.).',
          '— Développer un produit ou service concurrent en utilisant les sorties du Service.',
          '— Utiliser le Service pour générer du spam, du phishing ou toute forme de communication non sollicitée.',
          '— Usurper l\'identité d\'un tiers ou se faire passer pour un représentant de Netral.',
          'Toute violation pourra entraîner la suspension immédiate et définitive du compte sans préavis ni remboursement.',
        ],
      },
      {
        title: '5. Abonnements et paiement',
        content: [
          'Le Service propose un plan gratuit avec des fonctionnalités limitées, et des plans payants (Pro, Enterprise) avec des fonctionnalités avancées.',
          'Les tarifs sont indiqués en euros (€) et sont susceptibles d\'être modifiés. Toute modification tarifaire est notifiée à l\'Utilisateur au moins 30 jours avant son application.',
          'Le paiement s\'effectue par carte bancaire via un prestataire de paiement sécurisé (Stripe). Netral ne stocke aucune donnée bancaire.',
          'Les abonnements sont facturés mensuellement ou annuellement selon la formule choisie. Le renouvellement est automatique, sauf résiliation avant la date d\'échéance.',
          'Droit de rétractation : conformément à l\'article L.221-28 du Code de la consommation, le droit de rétractation de 14 jours ne s\'applique pas aux services numériques pleinement exécutés. L\'Utilisateur peut toutefois demander l\'annulation et le remboursement dans les 7 jours suivant la souscription.',
          'En cas de défaut de paiement, Netral se réserve le droit de suspendre l\'accès au Service après mise en demeure restée sans effet.',
        ],
      },
      {
        title: '6. Propriété intellectuelle',
        content: [
          'Contenu généré par l\'Utilisateur : les textes, codes, images et autres contenus générés par le Service à partir des requêtes de l\'Utilisateur appartiennent à l\'Utilisateur, sous réserve des droits des tiers.',
          'Attention : les réponses générées par l\'IA peuvent reproduire des extraits de données d\'entraînement protégées. Il incombe à l\'Utilisateur de vérifier l\'originalité du contenu avant toute exploitation commerciale.',
          'Le Service, sa marque, son code source, son interface, ses algorithmes, sa base de données et l\'ensemble de ses éléments constitutifs sont la propriété exclusive de Netral et sont protégés par le Code de la propriété intellectuelle.',
          'Toute reproduction, représentation, modification, adaptation, traduction ou extraction, totale ou partielle, du Service sans autorisation expresse est interdite.',
          'L\'Utilisateur concède à Netral une licence non-exclusive, gratuite et mondiale pour l\'utilisation de ses requêtes aux seules fins de fournir et d\'améliorer le Service. Cette licence ne couvre pas l\'entraînement de modèles tiers.',
        ],
      },
      {
        title: '7. Données personnelles et confidentialité',
        content: [
          'La collecte et le traitement des données personnelles sont régis par notre Politique de confidentialité, conforme au RGPD (Règlement Général sur la Protection des Données).',
          'Netral ne vend jamais les données personnelles à des tiers.',
          'Les conversations sont chiffrées en transit (TLS 1.3) et au repos (AES-256).',
          'Fonctionnalité « Mémoire contextuelle » : les préférences stockées (métier, langage de programmation, projets) peuvent être supprimées à tout moment depuis les paramètres du compte.',
          'Pour toute question relative à vos données : netral.ai.team@gmail.com.',
        ],
      },
      {
        title: '8. Responsabilité et garanties',
        content: [
          'Le Service est fourni « en l\'état » (« as is »). Netral ne garantit pas l\'exactitude, l\'exhaustivité ou la pertinence des réponses générées par l\'IA.',
          'L\'intelligence artificielle peut produire des réponses erronées, biaisées ou incomplètes (« hallucinations »). L\'Utilisateur reconnaît utiliser les résultats du Service sous sa propre responsabilité.',
          'Netral ne saurait être tenue responsable des dommages directs ou indirects résultant de l\'utilisation ou de l\'impossibilité d\'utilisation du Service, y compris les pertes de données, de chiffre d\'affaires ou de bénéfices.',
          'Netral met en œuvre tous les moyens raisonnables pour assurer la disponibilité du Service 24h/24, 7j/7, mais ne peut garantir une disponibilité ininterrompue. Des opérations de maintenance peuvent entraîner des interruptions temporaires.',
          'Netral se réserve le droit de faire évoluer, modifier ou supprimer des fonctionnalités du Service à tout moment.',
        ],
      },
      {
        title: '9. Liens et services tiers',
        content: [
          'Le Service peut intégrer des API et services tiers (Google, Stripe, fournisseurs de modèles d\'IA). Netral n\'exerce aucun contrôle sur ces services et décline toute responsabilité quant à leur disponibilité, leur contenu ou leurs pratiques.',
          'L\'intégration des services Google (Gmail, Calendar, Drive) est soumise aux conditions d\'utilisation de Google et nécessite l\'octroi explicite de permissions via OAuth 2.0.',
          'Les fournisseurs de modèles d\'IA (Mistral, Gemini, Kimi K2) n\'ont pas accès aux données des utilisateurs à des fins d\'entraînement.',
        ],
      },
      {
        title: '10. Résiliation',
        content: [
          'L\'Utilisateur peut résilier son compte et supprimer ses données à tout moment depuis les paramètres du compte, sans préavis.',
          'Netral peut suspendre ou résilier le compte d\'un Utilisateur en cas de violation des présentes CGU, après notification par email, sans préavis en cas de violation grave.',
          'En cas de résiliation, les données de l\'Utilisateur sont définitivement supprimées dans un délai de 30 jours, sous réserve des obligations légales de conservation.',
        ],
      },
      {
        title: '11. Modification des CGU',
        content: [
          'Netral se réserve le droit de modifier les présentes CGU à tout moment.',
          'En cas de modification substantielle, les Utilisateurs seront informés par email au moins 15 jours avant l\'entrée en vigueur des nouvelles CGU.',
          'L\'utilisation continue du Service après l\'entrée en vigueur des modifications vaut acceptation des nouvelles CGU.',
        ],
      },
      {
        title: '12. Droit applicable et juridiction',
        content: [
          'Les présentes CGU sont régies par le droit français.',
          'En cas de litige, les parties s\'efforceront de trouver une solution amiable avant toute action judiciaire.',
          'À défaut d\'accord amiable, le litige sera soumis aux tribunaux compétents de Paris, France.',
        ],
      },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: June 6, 2026',
    back: '← Back',
    intro: 'These Terms of Service (hereinafter "TOS") govern access to and use of the Netral platform (hereinafter "the Service"), operated by Netral, accessible via netral.app and its associated applications (VS Code extension, API). By using the Service, you unreservedly accept these TOS.',
    contactLabel: 'Contact',
    sections: [
      {
        title: '1. Definitions',
        content: [
          'Service: all functionalities offered by Netral, including the conversational AI assistant, VS Code extension, third-party integrations and APIs.',
          'User: any natural person of legal age or minor over 13 with parental authorization, who accesses the Service.',
          'Content: any data, text, code, image or information transmitted by the User or generated by the Service.',
          'Generative AI: artificial intelligence model producing responses from User queries.',
          'Contextual Memory: feature allowing the Service to retain preferences and information provided by the User to improve response relevance.',
        ],
      },
      {
        title: '2. Purpose and Service description',
        content: [
          'Netral is a multi-model conversational AI platform integrating:',
          '— An AI assistant with real-time web search, source citations and persistent contextual memory.',
          '— A native VS Code extension enabling AI-assisted code editing, generation and correction.',
          '— Integrations with Google services (Gmail, Calendar, Drive) via OAuth 2.0.',
          '— A REST API allowing developers to integrate Netral capabilities into their own applications.',
          'The Service is offered in several pricing plans (Free, Pro, Enterprise) detailed on the /pricing page.',
        ],
      },
      {
        title: '3. Access and registration',
        content: [
          'Access to the Service requires creating a user account via a valid email address or Google OAuth authentication.',
          'The User agrees to provide accurate, complete and up-to-date information during registration. Any false declaration may result in account suspension.',
          'The User is responsible for maintaining the confidentiality of their login credentials. Any use of the account via these credentials is deemed to have been made by the User.',
          'Minimum age required: 13 years. Minors under 16 must obtain parental consent.',
          'Netral reserves the right to refuse access to the Service to any person not complying with these TOS.',
        ],
      },
      {
        title: '4. Acceptable use',
        content: [
          'The User agrees not to use the Service for:',
          '— Any illegal or fraudulent activities or infringing third-party rights.',
          '— Generating, distributing or storing illegal, hateful, discriminatory, violent, pornographic content, or content inciting hatred or violence.',
          '— Circumventing technical limitations, usage quotas or security measures of the Service.',
          '— Attempting to reverse engineer, decompile or extract the Service source code.',
          '— Using unauthorized automated means (bots, scrapers) to access the Service.',
          '— Intentionally overloading or disrupting the Service infrastructure (DDoS, brute-force, etc.).',
          '— Developing a competing product or service using the Service outputs.',
          '— Using the Service to generate spam, phishing or any form of unsolicited communication.',
          '— Impersonating a third party or pretending to be a Netral representative.',
          'Any violation may result in immediate and permanent account suspension without notice or refund.',
        ],
      },
      {
        title: '5. Subscriptions and payment',
        content: [
          'The Service offers a free plan with limited features and paid plans (Pro, Enterprise) with advanced features.',
          'Prices are indicated in euros (€) and may be modified. Any price change is notified to the User at least 30 days before application.',
          'Payment is made by credit card via a secure payment provider (Stripe). Netral does not store any banking data.',
          'Subscriptions are billed monthly or annually according to the chosen plan. Renewal is automatic unless cancelled before the due date.',
          'Right of withdrawal: under article L.221-28 of the French Consumer Code, the 14-day withdrawal right does not apply to fully executed digital services. However, the User may request cancellation and refund within 7 days of subscription.',
          'In case of payment default, Netral reserves the right to suspend access to the Service after formal notice remains unanswered.',
        ],
      },
      {
        title: '6. Intellectual property',
        content: [
          'User-generated content: texts, code, images and other content generated by the Service from User queries belong to the User, subject to third-party rights.',
          'Attention: AI-generated responses may reproduce extracts from protected training data. It is the User\'s responsibility to verify content originality before any commercial exploitation.',
          'The Service, its brand, source code, interface, algorithms, database and all constituent elements are the exclusive property of Netral and are protected by intellectual property law.',
          'Any total or partial reproduction, representation, modification, adaptation, translation or extraction of the Service without express authorization is prohibited.',
          'The User grants Netral a non-exclusive, royalty-free, worldwide license to use their queries solely for providing and improving the Service. This license does not cover training of third-party models.',
        ],
      },
      {
        title: '7. Personal data and privacy',
        content: [
          'The collection and processing of personal data are governed by our Privacy Policy, compliant with GDPR (General Data Protection Regulation).',
          'Netral never sells personal data to third parties.',
          'Conversations are encrypted in transit (TLS 1.3) and at rest (AES-256).',
          '"Contextual Memory" feature: stored preferences (profession, programming language, projects) can be deleted at any time from account settings.',
          'For any questions regarding your data: netral.ai.team@gmail.com.',
        ],
      },
      {
        title: '8. Liability and warranties',
        content: [
          'The Service is provided "as is". Netral does not guarantee the accuracy, completeness or relevance of AI-generated responses.',
          'Artificial intelligence may produce erroneous, biased or incomplete responses ("hallucinations"). The User acknowledges using the Service results at their own risk.',
          'Netral shall not be held liable for direct or indirect damages resulting from the use or inability to use the Service, including loss of data, revenue or profits.',
          'Netral implements all reasonable means to ensure Service availability 24/7, but cannot guarantee uninterrupted availability. Maintenance operations may cause temporary interruptions.',
          'Netral reserves the right to evolve, modify or remove Service features at any time.',
        ],
      },
      {
        title: '9. Third-party links and services',
        content: [
          'The Service may integrate third-party APIs and services (Google, Stripe, AI model providers). Netral exercises no control over these services and declines all responsibility for their availability, content or practices.',
          'Integration of Google services (Gmail, Calendar, Drive) is subject to Google\'s terms of service and requires explicit permission grants via OAuth 2.0.',
          'AI model providers (Mistral, Gemini, Kimi K2) do not have access to user data for training purposes.',
        ],
      },
      {
        title: '10. Termination',
        content: [
          'The User may terminate their account and delete their data at any time from account settings, without notice.',
          'Netral may suspend or terminate a User\'s account in case of violation of these TOS, after email notification, without notice in case of serious violation.',
          'Upon termination, User data is permanently deleted within 30 days, subject to legal retention obligations.',
        ],
      },
      {
        title: '11. Modification of TOS',
        content: [
          'Netral reserves the right to modify these TOS at any time.',
          'In case of substantial modification, Users will be informed by email at least 15 days before the new TOS take effect.',
          'Continued use of the Service after the modifications take effect constitutes acceptance of the new TOS.',
        ],
      },
      {
        title: '12. Applicable law and jurisdiction',
        content: [
          'These TOS are governed by French law.',
          'In case of dispute, the parties will endeavor to find an amicable solution before any legal action.',
          'Failing amicable agreement, the dispute will be submitted to the competent courts of Paris, France.',
        ],
      },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  es: {
    title: 'Condiciones de Uso',
    updated: 'Última actualización: 6 de junio de 2026',
    back: '← Volver',
    intro: 'Las presentes Condiciones de Uso rigen el acceso y uso de la plataforma Netral, operada por Netral, accesible a través de netral.app. Al utilizar el Servicio, acepta sin reservas estas Condiciones.',
    contactLabel: 'Contacto',
    sections: [
      { title: '1. Definiciones', content: ['Servicio: todas las funcionalidades ofrecidas por Netral.', 'Usuario: persona física mayor de edad o mayor de 13 años con autorización parental.', 'Contenido: cualquier dato, texto, código o información transmitida o generada a través del Servicio.', 'Memoria contextual: funcionalidad que permite conservar preferencias del Usuario.'] },
      { title: '2. Descripción del Servicio', content: ['Netral es un asistente IA conversacional con búsqueda web en tiempo real, extensión VS Code e integraciones con servicios Google.'] },
      { title: '3. Registro', content: ['Se requiere crear una cuenta con email válido o autenticación Google OAuth.', 'Edad mínima: 13 años.', 'El Usuario es responsable de la confidencialidad de sus credenciales.'] },
      { title: '4. Uso aceptable', content: ['Prohibido: actividades ilegales, contenido ilícito, eludir límites, sobrecarga de servidores, spam, suplantación de identidad.', 'Cualquier infracción puede conllevar la suspensión de la cuenta.'] },
      { title: '5. Suscripciones', content: ['Planes Free, Pro y Enterprise. Los pagos se procesan a través de Stripe.', 'Las suscripciones se renuevan automáticamente. Cancelación posible en cualquier momento.'] },
      { title: '6. Propiedad intelectual', content: ['El contenido generado pertenece al Usuario, bajo verificación de originalidad.', 'Netral conserva todos los derechos sobre el Servicio, su código y su marca.'] },
      { title: '7. Datos personales', content: ['Véase nuestra Política de privacidad. Datos cifrados en tránsito y en reposo. Nunca vendemos datos.'] },
      { title: '8. Responsabilidad', content: ['Servicio prestado "tal cual". Las respuestas de IA pueden ser inexactas.', 'Netral no garantiza disponibilidad ininterrumpida.'] },
      { title: '9. Servicios de terceros', content: ['Netral no controla los servicios de terceros integrados (Google, Stripe).'] },
      { title: '10. Terminación', content: ['El Usuario puede eliminar su cuenta en cualquier momento.', 'Netral puede suspender cuentas por infracción de estas condiciones.'] },
      { title: '11. Modificaciones', content: ['Netral puede modificar estas condiciones notificando con 15 días de antelación.'] },
      { title: '12. Ley aplicable', content: ['Derecho francés. Tribunales competentes de París.'] },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  de: {
    title: 'Nutzungsbedingungen',
    updated: 'Zuletzt aktualisiert: 6. Juni 2026',
    back: '← Zurück',
    intro: 'Diese Nutzungsbedingungen regeln den Zugang und die Nutzung der Netral-Plattform. Durch die Nutzung des Dienstes akzeptieren Sie diese Bedingungen vorbehaltlos.',
    contactLabel: 'Kontakt',
    sections: [
      { title: '1. Definitionen', content: ['Dienst: alle Funktionalitäten von Netral.', 'Nutzer: natürliche Person über 13 Jahre.', 'Inhalt: alle über den Dienst übertragenen oder generierten Daten.', 'Kontextgedächtnis: Speicherung von Nutzerpräferenzen.'] },
      { title: '2. Dienstbeschreibung', content: ['Netral ist ein KI-Assistent mit Echtzeit-Websuche, VS Code-Erweiterung und Google-Integrationen.'] },
      { title: '3. Registrierung', content: ['Kontoerstellung mit gültiger E-Mail oder Google OAuth.', 'Mindestalter: 13 Jahre.', 'Der Nutzer ist für die Vertraulichkeit seiner Zugangsdaten verantwortlich.'] },
      { title: '4. Akzeptable Nutzung', content: ['Verboten: illegale Aktivitäten, rechtswidrige Inhalte, Umgehung von Limits, Serverüberlastung, Spam.', 'Verstöße können zur Kontosperrung führen.'] },
      { title: '5. Abonnements', content: ['Free-, Pro- und Enterprise-Pläne. Zahlung über Stripe.', 'Automatische Verlängerung. Kündigung jederzeit möglich.'] },
      { title: '6. Geistiges Eigentum', content: ['Generierte Inhalte gehören dem Nutzer, vorbehaltlich der Originalitätsprüfung.', 'Netral behält alle Rechte am Dienst, Code und der Marke.'] },
      { title: '7. Personenbezogene Daten', content: ['Siehe Datenschutzrichtlinie. Verschlüsselung in Transit und Ruhezustand. Kein Datenverkauf.'] },
      { title: '8. Haftung', content: ['Dienst "wie besehen". KI-Antworten können ungenau sein.', 'Keine Garantie für unterbrechungsfreie Verfügbarkeit.'] },
      { title: '9. Drittanbieter', content: ['Netral hat keine Kontrolle über integrierte Drittanbieter (Google, Stripe).'] },
      { title: '10. Kündigung', content: ['Nutzer kann Konto jederzeit löschen.', 'Netral kann Konten bei Verstößen sperren.'] },
      { title: '11. Änderungen', content: ['Netral kann Bedingungen mit 15-tägiger Ankündigung ändern.'] },
      { title: '12. Anwendbares Recht', content: ['Französisches Recht. Zuständige Gerichte in Paris.'] },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  it: {
    title: 'Condizioni di Utilizzo',
    updated: 'Ultimo aggiornamento: 6 giugno 2026',
    back: '← Indietro',
    intro: 'Le presenti Condizioni di Utilizzo regolano l\'accesso e l\'uso della piattaforma Netral. Utilizzando il Servizio, accettate senza riserve queste Condizioni.',
    contactLabel: 'Contatto',
    sections: [
      { title: '1. Definizioni', content: ['Servizio: tutte le funzionalità di Netral.', 'Utente: persona fisica di età superiore a 13 anni.', 'Contenuto: dati, testi o codici trasmessi o generati tramite il Servizio.', 'Memoria contestuale: conservazione delle preferenze dell\'Utente.'] },
      { title: '2. Descrizione del Servizio', content: ['Netral è un assistente IA con ricerca web in tempo reale, estensione VS Code e integrazioni Google.'] },
      { title: '3. Registrazione', content: ['Creazione account con email valida o Google OAuth.', 'Età minima: 13 anni.', 'L\'Utente è responsabile della riservatezza delle credenziali.'] },
      { title: '4. Uso accettabile', content: ['Vietati: attività illegali, contenuti illeciti, elusione dei limiti, spam.', 'Le violazioni possono comportare la sospensione dell\'account.'] },
      { title: '5. Abbonamenti', content: ['Piani Free, Pro e Enterprise. Pagamento tramite Stripe.', 'Rinnovo automatico. Disdetta in qualsiasi momento.'] },
      { title: '6. Proprietà intellettuale', content: ['I contenuti generati appartengono all\'Utente, previa verifica di originalità.', 'Netral conserva tutti i diritti sul Servizio, codice e marchio.'] },
      { title: '7. Dati personali', content: ['Vedere Informativa sulla privacy. Crittografia in transito e a riposo. Nessuna vendita di dati.'] },
      { title: '8. Responsabilità', content: ['Servizio fornito "così com\'è". Le risposte IA possono essere inesatte.', 'Nessuna garanzia di disponibilità ininterrotta.'] },
      { title: '9. Servizi di terze parti', content: ['Netral non controlla i servizi di terze parti integrati.'] },
      { title: '10. Cessazione', content: ['L\'Utente può eliminare l\'account in qualsiasi momento.', 'Netral può sospendere account per violazione.'] },
      { title: '11. Modifiche', content: ['Netral può modificare le condizioni con 15 giorni di preavviso.'] },
      { title: '12. Legge applicabile', content: ['Diritto francese. Foro competente di Parigi.'] },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  pt: {
    title: 'Condições de Utilização',
    updated: 'Última atualização: 6 de junho de 2026',
    back: '← Voltar',
    intro: 'As presentes Condições de Utilização regem o acesso e uso da plataforma Netral. Ao utilizar o Serviço, aceita sem reservas estas Condições.',
    contactLabel: 'Contato',
    sections: [
      { title: '1. Definições', content: ['Serviço: todas as funcionalidades da Netral.', 'Utilizador: pessoa singular com mais de 13 anos.', 'Conteúdo: dados, textos ou códigos transmitidos ou gerados.', 'Memória contextual: conservação das preferências do Utilizador.'] },
      { title: '2. Descrição do Serviço', content: ['Netral é um assistente IA com pesquisa web em tempo real, extensão VS Code e integrações Google.'] },
      { title: '3. Registo', content: ['Criação de conta com email ou Google OAuth.', 'Idade mínima: 13 anos.', 'O Utilizador é responsável pela confidencialidade das credenciais.'] },
      { title: '4. Utilização aceitável', content: ['Proibido: atividades ilegais, conteúdos ilícitos, violação de limites, spam.', 'Infrações podem resultar em suspensão da conta.'] },
      { title: '5. Assinaturas', content: ['Planos Free, Pro e Enterprise. Pagamento via Stripe.', 'Renovação automática. Cancelamento a qualquer momento.'] },
      { title: '6. Propriedade intelectual', content: ['Conteúdos gerados pertencem ao Utilizador.', 'Netral detém todos os direitos sobre o Serviço, código e marca.'] },
      { title: '7. Dados pessoais', content: ['Ver Política de privacidade. Encriptação em trânsito e em repouso. Nunca vendemos dados.'] },
      { title: '8. Responsabilidade', content: ['Serviço fornecido "como está". Respostas IA podem ser imprecisas.', 'Sem garantia de disponibilidade ininterrupta.'] },
      { title: '9. Serviços de terceiros', content: ['Netral não controla serviços de terceiros integrados.'] },
      { title: '10. Cessação', content: ['O Utilizador pode eliminar a conta a qualquer momento.', 'Netral pode suspender contas por violação.'] },
      { title: '11. Modificações', content: ['Netral pode modificar estas condições com aviso de 15 dias.'] },
      { title: '12. Lei aplicável', content: ['Direito francês. Tribunais competentes de Paris.'] },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
  ar: {
    title: 'شروط الاستخدام',
    updated: 'آخر تحديث: 6 يونيو 2026',
    back: '← رجوع',
    intro: 'تحكم شروط الاستخدام هذه الوصول إلى منصة Netral واستخدامها. باستخدامك للخدمة، فإنك توافق على هذه الشروط دون تحفظ.',
    contactLabel: 'التواصل',
    sections: [
      { title: '1. التعريفات', content: ['الخدمة: جميع وظائف Netral.', 'المستخدم: شخص طبيعي فوق 13 سنة.', 'المحتوى: البيانات أو النصوص أو الرموز المنقولة أو المنشأة.', 'الذاكرة السياقية: حفظ تفضيلات المستخدم.'] },
      { title: '2. وصف الخدمة', content: ['Netral مساعد ذكاء اصطناعي مع بحث ويب فوري وامتداد VS Code وتكاملات Google.'] },
      { title: '3. التسجيل', content: ['إنشاء حساب ببريد إلكتروني صالح أو Google OAuth.', 'الحد الأدنى للسن: 13 سنة.', 'المستخدم مسؤول عن سرية بيانات الدخول.'] },
      { title: '4. الاستخدام المقبول', content: ['ممنوع: الأنشطة غير القانونية، المحتوى غير المشروع، تجاوز الحدود، البريد المزعج.', 'المخالفات قد تؤدي إلى تعليق الحساب.'] },
      { title: '5. الاشتراكات', content: ['خطط Free و Pro و Enterprise. الدفع عبر Stripe.', 'تجديد تلقائي. يمكن الإلغاء في أي وقت.'] },
      { title: '6. الملكية الفكرية', content: ['المحتوى المنشأ ملك للمستخدم.', 'تحتفظ Netral بجميع الحقوق على الخدمة والكود والعلامة التجارية.'] },
      { title: '7. البيانات الشخصية', content: ['راجع سياسة الخصوصية. تشفير البيانات. لا نبيع البيانات أبداً.'] },
      { title: '8. المسؤولية', content: ['الخدمة مقدمة "كما هي". ردود الذكاء الاصطناعي قد تكون غير دقيقة.', 'لا ضمان لتوفر الخدمة دون انقطاع.'] },
      { title: '9. خدمات الطرف الثالث', content: ['Netral لا تتحكم في خدمات الطرف الثالث المدمجة.'] },
      { title: '10. الإنهاء', content: ['يمكن للمستخدم حذف الحساب في أي وقت.', 'يمكن لـ Netral تعليق الحسابات بسبب المخالفات.'] },
      { title: '11. التعديلات', content: ['يمكن لـ Netral تعديل الشروط مع إشعار بـ 15 يوماً.'] },
      { title: '12. القانون المطبق', content: ['القانون الفرنسي. المحاكم المختصة في باريس.'] },
    ],
    contactEmail: 'netral.ai.team@gmail.com',
  },
}

const FALLBACK_LANGS = ['zh', 'ja', 'ko', 'ru', 'hi', 'tr', 'nl', 'pl', 'uk']
FALLBACK_LANGS.forEach(lang => { if (!CONTENT[lang]) CONTENT[lang] = CONTENT.en })

export default function TermsPage() {
  const { locale } = useI18n()
  const c = CONTENT[locale] ?? CONTENT.en

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] py-20 px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] mb-8 inline-block transition-colors">
          {c.back}
        </Link>
        <h1 className="text-[36px] font-bold tracking-[-0.03em] mb-2">{c.title}</h1>
        <p className="text-[14px] text-[var(--fg-muted)] mb-4">{c.updated}</p>
        <p className="text-[14px] leading-[1.8] text-[var(--fg-soft)] mb-10 pb-10 border-b border-[var(--border)]">
          {c.intro}
        </p>

        <div className="space-y-8 text-[14px] leading-[1.8] text-[var(--fg-soft)]">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-[20px] font-semibold text-[var(--fg)] mb-3">{s.title}</h2>
              {Array.isArray(s.content) ? (
                <ul className="space-y-1.5">
                  {s.content.map((item) => (
                    <li key={item} className="flex gap-2">
                      {item.startsWith('—') || item.startsWith('-') ? (
                        <span className="shrink-0 text-[var(--fg-subtle)]">{item.startsWith('—') ? '—' : '•'}</span>
                      ) : null}
                      <span>{item.startsWith('—') || item.startsWith('-') ? item.slice(1).trim() : item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{s.content}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <p className="text-[13px] text-[var(--fg-muted)]">
            <strong className="text-[var(--fg)]">{c.contactLabel} :</strong>{' '}
            <a href="mailto:netral.ai.team@gmail.com" className="text-[var(--accent)] hover:underline">
              netral.ai.team@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}