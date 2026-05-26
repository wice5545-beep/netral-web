'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'

const CONTENT: Record<string, {
  title: string
  updated: string
  back: string
  sections: { title: string; content: string | string[] }[]
  contact: string
}> = {
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : 25 mai 2025',
    back: '← Retour',
    contact: 'Contact',
    sections: [
      { title: 'Données collectées', content: ['Compte : nom, email, mot de passe (hashé)', 'Conversations : messages échangés avec l\'IA', 'Usage : nombre de messages, plan, dates'] },
      { title: 'Utilisation des données', content: ['Fournir et améliorer le Service', 'Gérer votre compte et votre abonnement', 'Assurer la sécurité du Service — Nous ne vendons jamais vos données à des tiers.'] },
      { title: 'Stockage et sécurité', content: 'Vos données sont stockées sur des serveurs sécurisés. Les mots de passe sont hashés avec bcrypt. Les communications sont chiffrées via HTTPS/TLS.' },
      { title: 'Vos droits (RGPD)', content: ['Accès à vos données personnelles', 'Rectification de vos données', 'Suppression de votre compte et données', 'Portabilité de vos données', 'Opposition au traitement'] },
      { title: 'Cookies', content: 'Nous utilisons un cookie de session (httpOnly, secure) pour l\'authentification. Aucun cookie de tracking ou publicitaire n\'est utilisé.' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 25, 2025',
    back: '← Back',
    contact: 'Contact',
    sections: [
      { title: 'Data collected', content: ['Account: name, email, password (hashed)', 'Conversations: messages exchanged with the AI', 'Usage: message count, plan, dates'] },
      { title: 'Use of data', content: ['Provide and improve the Service', 'Manage your account and subscription', 'Ensure Service security — We never sell your data to third parties.'] },
      { title: 'Storage & security', content: 'Your data is stored on secure servers. Passwords are hashed with bcrypt. Communications are encrypted via HTTPS/TLS.' },
      { title: 'Your rights (GDPR)', content: ['Access to your personal data', 'Rectification of your data', 'Deletion of your account and data', 'Data portability', 'Right to object'] },
      { title: 'Cookies', content: 'We use a session cookie (httpOnly, secure) for authentication. No tracking or advertising cookies are used.' },
    ],
  },
  es: {
    title: 'Política de privacidad',
    updated: 'Última actualización: 25 de mayo de 2025',
    back: '← Volver',
    contact: 'Contacto',
    sections: [
      { title: 'Datos recopilados', content: ['Cuenta: nombre, email, contraseña (hasheada)', 'Conversaciones: mensajes intercambiados con la IA', 'Uso: número de mensajes, plan, fechas'] },
      { title: 'Uso de los datos', content: ['Proporcionar y mejorar el Servicio', 'Gestionar tu cuenta y suscripción', 'Garantizar la seguridad del Servicio — Nunca vendemos tus datos a terceros.'] },
      { title: 'Almacenamiento y seguridad', content: 'Tus datos se almacenan en servidores seguros. Las contraseñas se hashean con bcrypt. Las comunicaciones se cifran mediante HTTPS/TLS.' },
      { title: 'Tus derechos (RGPD)', content: ['Acceso a tus datos personales', 'Rectificación de tus datos', 'Eliminación de tu cuenta y datos', 'Portabilidad de datos', 'Derecho de oposición'] },
      { title: 'Cookies', content: 'Usamos una cookie de sesión (httpOnly, secure) para la autenticación. No se usan cookies de seguimiento ni publicitarias.' },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    updated: 'Zuletzt aktualisiert: 25. Mai 2025',
    back: '← Zurück',
    contact: 'Kontakt',
    sections: [
      { title: 'Erhobene Daten', content: ['Konto: Name, E-Mail, Passwort (gehasht)', 'Gespräche: mit der KI ausgetauschte Nachrichten', 'Nutzung: Nachrichtenanzahl, Plan, Daten'] },
      { title: 'Datenverwendung', content: ['Bereitstellung und Verbesserung des Dienstes', 'Verwaltung Ihres Kontos und Abonnements', 'Sicherheit des Dienstes gewährleisten — Wir verkaufen Ihre Daten niemals an Dritte.'] },
      { title: 'Speicherung & Sicherheit', content: 'Ihre Daten werden auf sicheren Servern gespeichert. Passwörter werden mit bcrypt gehasht. Die Kommunikation wird über HTTPS/TLS verschlüsselt.' },
      { title: 'Ihre Rechte (DSGVO)', content: ['Zugang zu Ihren persönlichen Daten', 'Berichtigung Ihrer Daten', 'Löschung Ihres Kontos und Ihrer Daten', 'Datenübertragbarkeit', 'Widerspruchsrecht'] },
      { title: 'Cookies', content: 'Wir verwenden ein Sitzungs-Cookie (httpOnly, secure) zur Authentifizierung. Es werden keine Tracking- oder Werbe-Cookies verwendet.' },
    ],
  },
  it: {
    title: 'Informativa sulla privacy',
    updated: 'Ultimo aggiornamento: 25 maggio 2025',
    back: '← Indietro',
    contact: 'Contatto',
    sections: [
      { title: 'Dati raccolti', content: ['Account: nome, email, password (hashata)', 'Conversazioni: messaggi scambiati con l\'IA', 'Utilizzo: numero di messaggi, piano, date'] },
      { title: 'Utilizzo dei dati', content: ['Fornire e migliorare il Servizio', 'Gestire il tuo account e abbonamento', 'Garantire la sicurezza del Servizio — Non vendiamo mai i tuoi dati a terzi.'] },
      { title: 'Archiviazione e sicurezza', content: 'I tuoi dati sono archiviati su server sicuri. Le password sono hashate con bcrypt. Le comunicazioni sono crittografate tramite HTTPS/TLS.' },
      { title: 'I tuoi diritti (GDPR)', content: ['Accesso ai tuoi dati personali', 'Rettifica dei tuoi dati', 'Cancellazione del tuo account e dati', 'Portabilità dei dati', 'Diritto di opposizione'] },
      { title: 'Cookie', content: 'Utilizziamo un cookie di sessione (httpOnly, secure) per l\'autenticazione. Non vengono utilizzati cookie di tracciamento o pubblicitari.' },
    ],
  },
  pt: {
    title: 'Política de privacidade',
    updated: 'Última atualização: 25 de maio de 2025',
    back: '← Voltar',
    contact: 'Contato',
    sections: [
      { title: 'Dados coletados', content: ['Conta: nome, email, senha (hash)', 'Conversas: mensagens trocadas com a IA', 'Uso: número de mensagens, plano, datas'] },
      { title: 'Uso dos dados', content: ['Fornecer e melhorar o Serviço', 'Gerenciar sua conta e assinatura', 'Garantir a segurança do Serviço — Nunca vendemos seus dados a terceiros.'] },
      { title: 'Armazenamento e segurança', content: 'Seus dados são armazenados em servidores seguros. As senhas são hashadas com bcrypt. As comunicações são criptografadas via HTTPS/TLS.' },
      { title: 'Seus direitos (LGPD/GDPR)', content: ['Acesso aos seus dados pessoais', 'Retificação dos seus dados', 'Exclusão da sua conta e dados', 'Portabilidade dos dados', 'Direito de oposição'] },
      { title: 'Cookies', content: 'Usamos um cookie de sessão (httpOnly, secure) para autenticação. Nenhum cookie de rastreamento ou publicidade é usado.' },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: 25 مايو 2025',
    back: '→ رجوع',
    contact: 'التواصل',
    sections: [
      { title: 'البيانات المجمعة', content: ['الحساب: الاسم، البريد الإلكتروني، كلمة المرور (مشفرة)', 'المحادثات: الرسائل المتبادلة مع الذكاء الاصطناعي', 'الاستخدام: عدد الرسائل، الخطة، التواريخ'] },
      { title: 'استخدام البيانات', content: ['تقديم الخدمة وتحسينها', 'إدارة حسابك واشتراكك', 'ضمان أمان الخدمة — لا نبيع بياناتك أبدًا لأطراف ثالثة.'] },
      { title: 'التخزين والأمان', content: 'يتم تخزين بياناتك على خوادم آمنة. يتم تشفير كلمات المرور باستخدام bcrypt. تُشفَّر الاتصالات عبر HTTPS/TLS.' },
      { title: 'حقوقك', content: ['الوصول إلى بياناتك الشخصية', 'تصحيح بياناتك', 'حذف حسابك وبياناتك', 'نقل البيانات', 'الاعتراض على المعالجة'] },
      { title: 'ملفات تعريف الارتباط', content: 'نستخدم ملف تعريف ارتباط للجلسة (httpOnly, secure) للمصادقة. لا تُستخدم ملفات تعريف ارتباط للتتبع أو الإعلانات.' },
    ],
  },
  zh: {
    title: '隐私政策',
    updated: '最后更新：2025年5月25日',
    back: '← 返回',
    contact: '联系方式',
    sections: [
      { title: '收集的数据', content: ['账户：姓名、邮箱、密码（哈希加密）', '对话：与AI交换的消息', '使用情况：消息数量、套餐、日期'] },
      { title: '数据使用', content: ['提供和改进服务', '管理您的账户和订阅', '确保服务安全——我们绝不向第三方出售您的数据。'] },
      { title: '存储与安全', content: '您的数据存储在安全服务器上。密码使用bcrypt哈希加密。通信通过HTTPS/TLS加密。' },
      { title: '您的权利（GDPR）', content: ['访问您的个人数据', '更正您的数据', '删除您的账户和数据', '数据可携带性', '反对处理的权利'] },
      { title: 'Cookie', content: '我们使用会话Cookie（httpOnly, secure）进行身份验证。不使用跟踪或广告Cookie。' },
    ],
  },
  ja: {
    title: 'プライバシーポリシー',
    updated: '最終更新：2025年5月25日',
    back: '← 戻る',
    contact: 'お問い合わせ',
    sections: [
      { title: '収集するデータ', content: ['アカウント：名前、メール、パスワード（ハッシュ化）', '会話：AIとやり取りしたメッセージ', '利用状況：メッセージ数、プラン、日付'] },
      { title: 'データの利用', content: ['サービスの提供と改善', 'アカウントとサブスクリプションの管理', 'サービスのセキュリティ確保 — 第三者にデータを販売することはありません。'] },
      { title: 'ストレージとセキュリティ', content: 'データは安全なサーバーに保存されます。パスワードはbcryptでハッシュ化されます。通信はHTTPS/TLSで暗号化されます。' },
      { title: 'お客様の権利（GDPR）', content: ['個人データへのアクセス', 'データの訂正', 'アカウントとデータの削除', 'データポータビリティ', '処理への異議申し立て'] },
      { title: 'Cookie', content: '認証のためにセッションCookie（httpOnly, secure）を使用します。トラッキングや広告Cookieは使用しません。' },
    ],
  },
  ko: {
    title: '개인정보 처리방침',
    updated: '최종 업데이트: 2025년 5월 25일',
    back: '← 뒤로',
    contact: '문의',
    sections: [
      { title: '수집하는 데이터', content: ['계정: 이름, 이메일, 비밀번호(해시)', '대화: AI와 교환한 메시지', '사용량: 메시지 수, 플랜, 날짜'] },
      { title: '데이터 사용', content: ['서비스 제공 및 개선', '계정 및 구독 관리', '서비스 보안 확보 — 제3자에게 데이터를 판매하지 않습니다.'] },
      { title: '저장 및 보안', content: '데이터는 안전한 서버에 저장됩니다. 비밀번호는 bcrypt로 해시됩니다. 통신은 HTTPS/TLS로 암호화됩니다.' },
      { title: '귀하의 권리(GDPR)', content: ['개인 데이터 접근', '데이터 수정', '계정 및 데이터 삭제', '데이터 이동성', '처리 반대 권리'] },
      { title: '쿠키', content: '인증을 위해 세션 쿠키(httpOnly, secure)를 사용합니다. 추적 또는 광고 쿠키는 사용하지 않습니다.' },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: 25 мая 2025 г.',
    back: '← Назад',
    contact: 'Контакт',
    sections: [
      { title: 'Собираемые данные', content: ['Аккаунт: имя, email, пароль (хэш)', 'Разговоры: сообщения, обменянные с ИИ', 'Использование: количество сообщений, план, даты'] },
      { title: 'Использование данных', content: ['Предоставление и улучшение Сервиса', 'Управление вашим аккаунтом и подпиской', 'Обеспечение безопасности Сервиса — Мы никогда не продаём ваши данные третьим лицам.'] },
      { title: 'Хранение и безопасность', content: 'Ваши данные хранятся на защищённых серверах. Пароли хэшируются с помощью bcrypt. Связь шифруется через HTTPS/TLS.' },
      { title: 'Ваши права (GDPR)', content: ['Доступ к вашим персональным данным', 'Исправление ваших данных', 'Удаление аккаунта и данных', 'Переносимость данных', 'Право на возражение'] },
      { title: 'Cookies', content: 'Мы используем сессионный cookie (httpOnly, secure) для аутентификации. Трекинговые или рекламные cookies не используются.' },
    ],
  },
  hi: {
    title: 'गोपनीयता नीति',
    updated: 'अंतिम अपडेट: 25 मई 2025',
    back: '← वापस',
    contact: 'संपर्क',
    sections: [
      { title: 'एकत्रित डेटा', content: ['खाता: नाम, ईमेल, पासवर्ड (हैश)', 'बातचीत: AI के साथ आदान-प्रदान किए गए संदेश', 'उपयोग: संदेशों की संख्या, प्लान, तारीखें'] },
      { title: 'डेटा का उपयोग', content: ['सेवा प्रदान करना और सुधारना', 'आपके खाते और सदस्यता का प्रबंधन', 'सेवा की सुरक्षा सुनिश्चित करना — हम कभी भी आपका डेटा तीसरे पक्ष को नहीं बेचते।'] },
      { title: 'भंडारण और सुरक्षा', content: 'आपका डेटा सुरक्षित सर्वर पर संग्रहीत है। पासवर्ड bcrypt से हैश किए जाते हैं। संचार HTTPS/TLS के माध्यम से एन्क्रिप्ट किया जाता है।' },
      { title: 'आपके अधिकार (GDPR)', content: ['व्यक्तिगत डेटा तक पहुंच', 'डेटा सुधार', 'खाता और डेटा हटाना', 'डेटा पोर्टेबिलिटी', 'प्रसंस्करण पर आपत्ति'] },
      { title: 'कुकीज़', content: 'हम प्रमाणीकरण के लिए एक सत्र कुकी (httpOnly, secure) का उपयोग करते हैं। कोई ट्रैकिंग या विज्ञापन कुकीज़ उपयोग नहीं की जाती।' },
    ],
  },
  tr: {
    title: 'Gizlilik Politikası',
    updated: 'Son güncelleme: 25 Mayıs 2025',
    back: '← Geri',
    contact: 'İletişim',
    sections: [
      { title: 'Toplanan veriler', content: ['Hesap: ad, e-posta, şifre (hash\'li)', 'Konuşmalar: AI ile alışverilen mesajlar', 'Kullanım: mesaj sayısı, plan, tarihler'] },
      { title: 'Veri kullanımı', content: ['Hizmeti sağlamak ve geliştirmek', 'Hesabınızı ve aboneliğinizi yönetmek', 'Hizmet güvenliğini sağlamak — Verilerinizi asla üçüncü taraflara satmıyoruz.'] },
      { title: 'Depolama ve güvenlik', content: 'Verileriniz güvenli sunucularda saklanır. Şifreler bcrypt ile hashlenir. İletişim HTTPS/TLS ile şifrelenir.' },
      { title: 'Haklarınız (GDPR)', content: ['Kişisel verilerinize erişim', 'Verilerinizin düzeltilmesi', 'Hesabınızın ve verilerinizin silinmesi', 'Veri taşınabilirliği', 'İşlemeye itiraz hakkı'] },
      { title: 'Çerezler', content: 'Kimlik doğrulama için bir oturum çerezi (httpOnly, secure) kullanıyoruz. İzleme veya reklam çerezi kullanılmıyor.' },
    ],
  },
  nl: {
    title: 'Privacybeleid',
    updated: 'Laatste update: 25 mei 2025',
    back: '← Terug',
    contact: 'Contact',
    sections: [
      { title: 'Verzamelde gegevens', content: ['Account: naam, e-mail, wachtwoord (gehasht)', 'Gesprekken: berichten uitgewisseld met de AI', 'Gebruik: aantal berichten, plan, datums'] },
      { title: 'Gebruik van gegevens', content: ['De Service leveren en verbeteren', 'Uw account en abonnement beheren', 'De veiligheid van de Service waarborgen — We verkopen uw gegevens nooit aan derden.'] },
      { title: 'Opslag en beveiliging', content: 'Uw gegevens worden opgeslagen op beveiligde servers. Wachtwoorden worden gehasht met bcrypt. Communicatie wordt versleuteld via HTTPS/TLS.' },
      { title: 'Uw rechten (AVG)', content: ['Toegang tot uw persoonsgegevens', 'Rectificatie van uw gegevens', 'Verwijdering van uw account en gegevens', 'Gegevensoverdraagbaarheid', 'Recht van bezwaar'] },
      { title: 'Cookies', content: 'We gebruiken een sessiecookie (httpOnly, secure) voor authenticatie. Er worden geen tracking- of advertentiecookies gebruikt.' },
    ],
  },
  pl: {
    title: 'Polityka prywatności',
    updated: 'Ostatnia aktualizacja: 25 maja 2025',
    back: '← Wstecz',
    contact: 'Kontakt',
    sections: [
      { title: 'Zbierane dane', content: ['Konto: imię, e-mail, hasło (zahashowane)', 'Rozmowy: wiadomości wymieniane z AI', 'Użytkowanie: liczba wiadomości, plan, daty'] },
      { title: 'Wykorzystanie danych', content: ['Świadczenie i ulepszanie Usługi', 'Zarządzanie kontem i subskrypcją', 'Zapewnienie bezpieczeństwa Usługi — Nigdy nie sprzedajemy Twoich danych stronom trzecim.'] },
      { title: 'Przechowywanie i bezpieczeństwo', content: 'Twoje dane są przechowywane na bezpiecznych serwerach. Hasła są hashowane za pomocą bcrypt. Komunikacja jest szyfrowana przez HTTPS/TLS.' },
      { title: 'Twoje prawa (RODO)', content: ['Dostęp do danych osobowych', 'Sprostowanie danych', 'Usunięcie konta i danych', 'Przenoszalność danych', 'Prawo do sprzeciwu'] },
      { title: 'Pliki cookie', content: 'Używamy sesyjnego pliku cookie (httpOnly, secure) do uwierzytelniania. Nie używamy plików cookie śledzących ani reklamowych.' },
    ],
  },
  uk: {
    title: 'Політика конфіденційності',
    updated: 'Останнє оновлення: 25 травня 2025 р.',
    back: '← Назад',
    contact: 'Контакт',
    sections: [
      { title: 'Дані, що збираються', content: ['Обліковий запис: ім\'я, email, пароль (хеш)', 'Розмови: повідомлення, обмінені з ШІ', 'Використання: кількість повідомлень, план, дати'] },
      { title: 'Використання даних', content: ['Надання та покращення Сервісу', 'Управління вашим обліковим записом і підпискою', 'Забезпечення безпеки Сервісу — Ми ніколи не продаємо ваші дані третім особам.'] },
      { title: 'Зберігання та безпека', content: 'Ваші дані зберігаються на захищених серверах. Паролі хешуються за допомогою bcrypt. Зв\'язок шифрується через HTTPS/TLS.' },
      { title: 'Ваші права (GDPR)', content: ['Доступ до ваших персональних даних', 'Виправлення ваших даних', 'Видалення облікового запису та даних', 'Переносимість даних', 'Право на заперечення'] },
      { title: 'Cookies', content: 'Ми використовуємо сесійний cookie (httpOnly, secure) для автентифікації. Трекінгові або рекламні cookies не використовуються.' },
    ],
  },
}

export default function PrivacyPage() {
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
          <section>
            <h2 className="text-[18px] font-semibold text-[var(--fg)] mb-3">{c.contact}</h2>
            <p><strong className="text-[var(--fg)]">Email :</strong> netral.ai.team@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
