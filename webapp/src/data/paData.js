// ============================================================
//  Power Automate Template Data
//  Allgemeines PA-Projekt-Template (nicht kundenspezifisch)
// ============================================================

// ── KPIs ─────────────────────────────────────────────────────
export const PA_KPIS = [
  { id: 'kpi1', label: 'Honorar (netto)',    value: '€2.400',         icon: '💶', adminOnly: true },
  { id: 'kpi2', label: 'Stundenaufwand',     value: '30h',            icon: '⏱',  adminOnly: true },
  { id: 'kpi3', label: 'Phasen',            value: '5',              icon: '📋', adminOnly: false },
  { id: 'kpi4', label: 'Go-Live',           value: '3 Wochen',       icon: '🚀', adminOnly: false },
  { id: 'kpi5', label: 'Flows',             value: '6',              icon: '⚡', adminOnly: false },
  { id: 'kpi6', label: 'Lizenz (PA Prem.)', value: '€15/User/Mo.',   icon: '🔑', adminOnly: true },
]

// ── PHASEN ───────────────────────────────────────────────────
export const PA_PHASES = [
  {
    id: 'pa-p1',
    title: 'Phase 1: M365 & Power Platform Setup',
    hours: 4,
    honorar: 320,
    color: '#0078D4',
    icon: '🏗',
    description: 'Microsoft 365 Umgebung prüfen, Power Platform einrichten, Lizenzen zuweisen, Sicherheitsrichtlinien konfigurieren.',
    tasks: [
      { id: 'pa-p1t1', title: 'Lizenz-Check: Power Automate Lizenzen prüfen und zuweisen', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p1t2', title: 'Power Platform Umgebungen anlegen (Dev / Test / Prod)', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p1t3', title: 'Data Loss Prevention (DLP) Policies konfigurieren', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p1t4', title: 'Connector-Berechtigungen festlegen (Standard vs. Premium)', done: false, notes: '', available_from: 'premium' },
      { id: 'pa-p1t5', title: 'Power Platform Admin Center einrichten und Admin-User anlegen', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p1t6', title: 'Security & Compliance: Umgebungsrollen und Zugriffsmatrix', done: false, notes: '', available_from: 'free' },
    ],
  },
  {
    id: 'pa-p2',
    title: 'Phase 2: Datenquellen & Connectors',
    hours: 6,
    honorar: 480,
    color: '#0078D4',
    icon: '🔌',
    description: 'JTL Custom Connector einrichten, Microsoft 365 Dienste verbinden, Trigger-Definitionen dokumentieren.',
    tasks: [
      { id: 'pa-p2t1', title: 'JTL Custom Connector erstellen (HTTP Request / Webhook)', done: false, notes: 'JTL REST API Schlüssel benötigt', available_from: 'premium' },
      { id: 'pa-p2t2', title: 'JTL Webhook-Endpunkte konfigurieren (Bestellung, Retoure, Statusänderung)', done: false, notes: '', available_from: 'premium' },
      { id: 'pa-p2t3', title: 'Outlook 365 Connector authentifizieren und testen', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p2t4', title: 'Microsoft Teams Connector einrichten (Channel + Bot)', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p2t5', title: 'SharePoint Online Site für Dokumentenablage erstellen', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p2t6', title: 'Trigger-Definitionen und JSON-Schemas dokumentieren', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p2t7', title: 'Zendesk Premium Connector konfigurieren (falls vorhanden)', done: false, notes: '', available_from: 'premium' },
    ],
  },
  {
    id: 'pa-p3',
    title: 'Phase 3: Automatisierungs-Flows entwickeln',
    hours: 10,
    honorar: 800,
    color: '#0078D4',
    icon: '⚡',
    description: 'Die 6 Kern-Flows entwickeln, testen und in die Produktion-Umgebung deployen.',
    tasks: [
      { id: 'pa-p3t1', title: 'F-01: Bestellbenachrichtigung — JTL Webhook → Zendesk Ticket + Teams', done: false, notes: 'Cloud Flow (Automated), Trigger: HTTP Request', available_from: 'premium' },
      { id: 'pa-p3t2', title: 'F-02: Retoure-Workflow — JTL Webhook → SharePoint + Approval-Flow', done: false, notes: 'Cloud Flow (Automated), beinhaltet Manager-Genehmigung', available_from: 'premium' },
      { id: 'pa-p3t3', title: 'F-03: Eskalation-Routing — SLA-Check → Eskalations-Mail', done: false, notes: 'Scheduled Flow, stündlich', available_from: 'free' },
      { id: 'pa-p3t4', title: 'F-04: Täglicher Report — Aggregation → Teams/Outlook-Mail', done: false, notes: 'Scheduled Flow, Mo–Fr 07:00', available_from: 'free' },
      { id: 'pa-p3t5', title: 'F-05: SLA-Warning — Alert wenn < 2h bis SLA-Ablauf', done: false, notes: 'Scheduled Flow, alle 30 Minuten', available_from: 'free' },
      { id: 'pa-p3t6', title: 'F-06: Außerhalb Geschäftszeiten — Auto-Reply + Zendesk Tag', done: false, notes: 'Cloud Flow (Automated), Outlook-Trigger + Zeitprüfung', available_from: 'free' },
      { id: 'pa-p3t7', title: 'Alle Flows in Dev-Umgebung testen (Happy-Path + Fehlerfälle)', done: false, notes: '', available_from: 'free' },
    ],
  },
  {
    id: 'pa-p4',
    title: 'Phase 4: Fehlerbehandlung & Monitoring',
    hours: 4,
    honorar: 320,
    color: '#0078D4',
    icon: '🔍',
    description: 'Robustes Exception-Handling, Monitoring-Dashboard einrichten, Error-Alerts konfigurieren.',
    tasks: [
      { id: 'pa-p4t1', title: 'Exception-Handling in allen 6 Flows implementieren (Scope + Configure run after)', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p4t2', title: 'Error-Alert-Flow erstellen (Flow-Fehler → Admin E-Mail + Teams)', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p4t3', title: 'Power Automate Monitor-Dashboard konfigurieren', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p4t4', title: 'Run-History und Audit-Log für alle Flows einrichten', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p4t5', title: 'Flow-Quotas prüfen und API-Limits dokumentieren', done: false, notes: 'Premium: 40.000 API Calls/Tag/User', available_from: 'free' },
    ],
  },
  {
    id: 'pa-p5',
    title: 'Phase 5: Dokumentation, Schulung & Go-Live',
    hours: 6,
    honorar: 480,
    color: '#0078D4',
    icon: '🎓',
    description: 'Flow-Dokumentation erstellen, Admin-Schulung durchführen, Go-Live freigeben, Hypercare-Phase begleiten.',
    tasks: [
      { id: 'pa-p5t1', title: 'Flow-Dokumentation erstellen (Trigger → Logik → Aktionen → Fehlerfälle)', done: false, notes: 'In SharePoint ablegen', available_from: 'free' },
      { id: 'pa-p5t2', title: 'Admin-Schulung Power Automate (90 Min. Remote): Flows bearbeiten, Monitor, Debugging', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p5t3', title: 'Quick-Guide für Endnutzer erstellen (Instant Flows per Teams/Mobile nutzen)', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p5t4', title: 'Go-Live: Flows in Prod-Umgebung aktivieren, letzte Smoke-Tests', done: false, notes: '', available_from: 'free' },
      { id: 'pa-p5t5', title: 'Hypercare: 2-Wochen-Betreuung nach Go-Live', done: false, notes: '30-Tage-Nachbetreuung inklusive', available_from: 'free' },
    ],
  },
]

// ── FLOWS (gespeichert als "macros" Key für Kompatibilität) ──
export const PA_FLOWS = [
  {
    id: 'F-01',
    name: 'Bestellbenachrichtigung',
    type: 'Cloud Flow (Automated)',
    flowType: 'automated',
    trigger: 'HTTP Request — JTL Bestellereignis (Webhook)',
    connectors: ['JTL Custom (HTTP)', 'Microsoft Teams', 'Outlook 365', 'Zendesk'],
    description: 'Neue Bestellung in JTL löst Webhook aus. Power Automate parst die JSON-Payload, erstellt ein Zendesk-Ticket und sendet eine Teams Adaptive Card an den Bestellungs-Channel.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'HTTP Request empfangen (JTL Webhook) — JSON-Payload mit order_id, customer, products, price' },
      { step: 2, label: 'Bedingung', desc: 'Preis > €500? → Priority "high" / Sonst → Priority "normal"' },
      { step: 3, label: 'Aktion', desc: 'Zendesk Ticket erstellen: Subject = "Neue Bestellung #[order_id]", Tags = ["bestellung", "jtl"]' },
      { step: 4, label: 'Aktion', desc: 'Teams Adaptive Card senden an #bestellungen: Kundenname, Betrag, Artikel, Ticket-Link' },
      { step: 5, label: 'Aktion', desc: 'Outlook-Bestätigung an Kunden (optional, wenn kein JTL-Mailing)' },
    ],
    priority: 'hoch',
    available_from: 'premium',
  },
  {
    id: 'F-02',
    name: 'Retoure-Workflow',
    type: 'Cloud Flow (Automated)',
    flowType: 'automated',
    trigger: 'HTTP Request — JTL Retouren-Ereignis (Webhook)',
    connectors: ['JTL Custom (HTTP)', 'SharePoint Online', 'Outlook 365', 'Microsoft Teams'],
    description: 'Neue Retoure in JTL startet automatisch einen Genehmigungsworkflow. Teamleiter erhält E-Mail + Teams-Nachricht. Nach Genehmigung wird ein SharePoint-Listeneintrag erstellt.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'HTTP Request empfangen (JTL Retoure) — JSON mit return_id, order_id, reason, amount' },
      { step: 2, label: 'Aktion', desc: 'SharePoint-Listeneintrag erstellen in "Retouren-Log": Status = "Offen"' },
      { step: 3, label: 'Approval', desc: 'Start and wait for an approval → Teamleiter per E-Mail + Teams benachrichtigen' },
      { step: 4, label: 'Bedingung', desc: 'Genehmigt → SharePoint-Status auf "Genehmigt", Gutschrift-Mail an Kunden' },
      { step: 5, label: 'Bedingung', desc: 'Abgelehnt → SharePoint-Status auf "Abgelehnt", Ablehnungs-Mail an Kunden' },
    ],
    priority: 'hoch',
    available_from: 'premium',
  },
  {
    id: 'F-03',
    name: 'Eskalation-Routing',
    type: 'Scheduled Flow',
    flowType: 'scheduled',
    trigger: 'Recurrence — stündlich',
    connectors: ['Zendesk (HTTP)', 'Outlook 365', 'Microsoft Teams'],
    description: 'Stündliche Prüfung aller offenen Zendesk-Tickets gegen SLA-Zeiten. Tickets die in < 2h ablaufen werden an den Teamleiter eskaliert.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'Recurrence — jede Stunde' },
      { step: 2, label: 'Aktion', desc: 'Zendesk API: GET /api/v2/tickets?status=open — alle offenen Tickets holen' },
      { step: 3, label: 'Schleife', desc: 'Apply to each ticket: SLA-Restzeit berechnen (Erstellungsdatum + SLA-Target)' },
      { step: 4, label: 'Bedingung', desc: 'Restzeit < 2h? → Eskalation auslösen' },
      { step: 5, label: 'Aktion', desc: 'Outlook-Mail an Teamleiter + Teams @mention in #eskalation Channel' },
    ],
    priority: 'mittel',
    available_from: 'free',
  },
  {
    id: 'F-04',
    name: 'Täglicher Report',
    type: 'Scheduled Flow',
    flowType: 'scheduled',
    trigger: 'Recurrence — Mo–Fr, 07:00 Uhr',
    connectors: ['Zendesk (HTTP)', 'Microsoft Teams', 'Outlook 365'],
    description: 'Werktäglich um 07:00 Uhr wird ein Tages-Report über neue, offene und gelöste Tickets der letzten 24h aggregiert und per Teams + E-Mail an das Management gesendet.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'Recurrence — Mo–Fr 07:00 Uhr (Europe/Berlin)' },
      { step: 2, label: 'Aktion', desc: 'Zendesk API: Neue Tickets gestern, offene Tickets total, gelöste Tickets gestern, Avg. Lösungszeit' },
      { step: 3, label: 'Aktion', desc: 'Variablen berechnen: Offen-Rate, SLA-Einhaltung in %' },
      { step: 4, label: 'Aktion', desc: 'Teams-Nachricht mit Zusammenfassung + KPI-Tabelle an #management' },
      { step: 5, label: 'Aktion', desc: 'Outlook-Mail mit HTML-Report an Verteiler' },
    ],
    priority: 'mittel',
    available_from: 'free',
  },
  {
    id: 'F-05',
    name: 'SLA-Warning',
    type: 'Scheduled Flow',
    flowType: 'scheduled',
    trigger: 'Recurrence — alle 30 Minuten',
    connectors: ['Zendesk (HTTP)', 'Microsoft Teams', 'Outlook 365'],
    description: 'Alle 30 Minuten werden offene Tickets gegen SLA-Fristen geprüft. Bei kritischen Tickets (< 2h verbleibend) wird automatisch ein Warning ausgelöst.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'Recurrence — alle 30 Minuten' },
      { step: 2, label: 'Aktion', desc: 'Zendesk API: Offene Tickets mit SLA-Status holen (Endpoint: sla_policies)' },
      { step: 3, label: 'Schleife', desc: 'For each ticket: SLA-Restzeit berechnen (next_breach_at - now)' },
      { step: 4, label: 'Bedingung', desc: 'Restzeit < 120 Minuten UND noch nicht gewarnt? → Warning-Flag setzen' },
      { step: 5, label: 'Aktion', desc: 'Teams Urgent-Nachricht + Outlook-Alert an zuständigen Agenten' },
    ],
    priority: 'hoch',
    available_from: 'free',
  },
  {
    id: 'F-06',
    name: 'Außerhalb Geschäftszeiten',
    type: 'Cloud Flow (Automated)',
    flowType: 'automated',
    trigger: 'Outlook — neue E-Mail eingetroffen',
    connectors: ['Outlook 365', 'Zendesk (HTTP)'],
    description: 'Bei E-Mail-Eingang außerhalb der Geschäftszeiten (Mo–Fr 08–18 Uhr) sendet der Flow automatisch eine Abwesenheits-Antwort und taggt das Zendesk-Ticket für Rückruf.',
    steps: [
      { step: 1, label: 'Trigger', desc: 'When a new email arrives in Inbox (Outlook 365)' },
      { step: 2, label: 'Aktion', desc: 'Aktuelle Zeit (Europe/Berlin) ermitteln: convertTimeZone()' },
      { step: 3, label: 'Bedingung', desc: 'Außerhalb Geschäftszeiten ODER Wochenende? (Mo–Fr 08:00–18:00)' },
      { step: 4, label: 'Aktion', desc: 'Outlook: Auto-Reply senden "Wir sind Mo–Fr 08–18 Uhr erreichbar. Nächster Werktag..."' },
      { step: 5, label: 'Aktion', desc: 'Zendesk Ticket-Tag hinzufügen: "ausserhalb-gez" für priorisierte Bearbeitung' },
    ],
    priority: 'niedrig',
    available_from: 'free',
  },
]

// ── RISIKEN ──────────────────────────────────────────────────
export const PA_RISKS = [
  {
    id: 'pa-r1',
    title: 'JTL Custom Connector Stabilität',
    level: 'hoch',
    description: 'JTL bietet keine offizielle Power Automate Integration. Der Custom Connector über HTTP/Webhooks ist anfällig für JTL-Updates (API-Änderungen brechen den Connector).',
    mitigation: 'Versionsnummer der JTL REST API dokumentieren. Changelog beobachten. Fehler-Handling im Flow robust gestalten.',
  },
  {
    id: 'pa-r2',
    title: 'Tenant-Sicherheitsrichtlinien blockieren Connectors',
    level: 'mittel',
    description: 'Enterprise-Tenants mit restriktiven Richtlinien können externe Premium-Connectors blockieren. DLP-Policies müssen vorab geprüft werden.',
    mitigation: 'IT-Admin einbinden, DLP-Policies vor Projektstart analysieren. Test-Umgebung mit echten Richtlinien aufsetzen.',
  },
  {
    id: 'pa-r3',
    title: 'DLP-Policy Konflikte',
    level: 'mittel',
    description: 'Data Loss Prevention Policies können verhindern, dass bestimmte Connectors miteinander kombiniert werden (z.B. JTL + Outlook).',
    mitigation: 'DLP-Policy-Überprüfung in Phase 1. Ggf. separate Umgebung für Business-kritische Flows anlegen.',
  },
  {
    id: 'pa-r4',
    title: 'M365-Lizenz-Zuweisung',
    level: 'mittel',
    description: 'Nicht alle Nutzer haben Power Automate Premium-Lizenzen. Flows mit Premium-Connectors laufen nur unter einem lizenzierten Service-Account.',
    mitigation: 'Service-Account mit Power Automate Premium für Flow-Ausführung nutzen. Lizenz-Kosten vorab klären.',
  },
  {
    id: 'pa-r5',
    title: 'Flow-API Quotas und Rate-Limits',
    level: 'niedrig',
    description: 'Power Automate hat API-Call-Limits (ca. 40.000/Tag bei Premium). Bei hohem Bestellvolumen können Limits erreicht werden.',
    mitigation: 'API-Call-Verbrauch in Phase 3 schätzen. Bei Bedarf: Process-Plan oder Batching der API-Calls.',
  },
  {
    id: 'pa-r6',
    title: 'SharePoint-Berechtigungen',
    level: 'niedrig',
    description: 'Flows die auf SharePoint-Listen schreiben benötigen korrekte Berechtigungen des Service-Accounts. Fehlkonfiguration führt zu stillen Failures.',
    mitigation: 'Service-Account als SharePoint-Site-Member einrichten. Permissions in Phase 2 testen.',
  },
]

// ── GO-LIVE CHECKLISTE ────────────────────────────────────────
export const PA_GOLIVELISTE = [
  { id: 'pa-gl01', text: 'Power Platform Umgebungen (Dev/Test/Prod) angelegt und dokumentiert', done: false, blocking: true, available_from: 'free' },
  { id: 'pa-gl02', text: 'DLP-Policies aktiv und geprüft (kein Connector blockiert)', done: false, blocking: true, available_from: 'free' },
  { id: 'pa-gl03', text: 'JTL Custom Connector: Authentifizierung erfolgreich', done: false, blocking: true, available_from: 'premium' },
  { id: 'pa-gl04', text: 'Alle 6 Flows in Test-Umgebung erfolgreich durchlaufen', done: false, blocking: true, available_from: 'free' },
  { id: 'pa-gl05', text: 'Alle 6 Flows in Prod-Umgebung aktiviert', done: false, blocking: true, available_from: 'free' },
  { id: 'pa-gl06', text: 'Error-Alert-Flow aktiv (Flow-Fehler → Admin-Benachrichtigung)', done: false, blocking: true, available_from: 'free' },
  { id: 'pa-gl07', text: 'Power Automate Monitor: Run-History und Dashboards konfiguriert', done: false, blocking: false, available_from: 'free' },
  { id: 'pa-gl08', text: 'Admin-Schulung abgenommen (Protokoll vorhanden)', done: false, blocking: false, available_from: 'free' },
  { id: 'pa-gl09', text: 'Flow-Dokumentation in SharePoint abgelegt', done: false, blocking: false, available_from: 'free' },
  { id: 'pa-gl10', text: 'Quick-Guide für Endnutzer verteilt', done: false, blocking: false, available_from: 'free' },
  { id: 'pa-gl11', text: 'Approval-Flow (F-02 Retoure) mit echtem Genehmiger getestet', done: false, blocking: true, available_from: 'premium' },
  { id: 'pa-gl12', text: 'SLA-Warning Flow (F-05) im Live-Betrieb geprüft', done: false, blocking: false, available_from: 'free' },
]

// ── ENVIRONMENTS (statt DNS-Records) ─────────────────────────
export const PA_ENVIRONMENTS = [
  {
    id: 'env-dev',
    name: 'Development',
    short: 'DEV',
    url: 'https://org-dev.crm4.dynamics.com',
    powerPlatformId: '',
    status: 'pending',
    description: 'Entwicklungsumgebung: Flow-Entwicklung, erster Test. Keine echten Daten.',
  },
  {
    id: 'env-test',
    name: 'Test / Staging',
    short: 'TEST',
    url: 'https://org-test.crm4.dynamics.com',
    powerPlatformId: '',
    status: 'pending',
    description: 'Test-Umgebung: User Acceptance Tests mit echten Connector-Verbindungen (separaten Credentials).',
  },
  {
    id: 'env-prod',
    name: 'Production',
    short: 'PROD',
    url: 'https://org.crm4.dynamics.com',
    powerPlatformId: '',
    status: 'pending',
    description: 'Produktionsumgebung: Alle aktiven Flows. Nur genehmigter Code per Solution-Deployment.',
  },
]

// ── CONNECTOR REFERENZEN (statt DNS-Records) ─────────────────
export const PA_CONNECTIONS = [
  { id: 'conn-jtl',   name: 'JTL Custom Connector',   type: 'Premium',  auth: 'API Key (HTTP Header)',    status: 'pending', icon: '🛒' },
  { id: 'conn-out',   name: 'Outlook 365',             type: 'Standard', auth: 'OAuth 2.0 (Org-Account)', status: 'pending', icon: '📧' },
  { id: 'conn-teams', name: 'Microsoft Teams',         type: 'Standard', auth: 'OAuth 2.0 (Org-Account)', status: 'pending', icon: '💬' },
  { id: 'conn-sp',    name: 'SharePoint Online',       type: 'Standard', auth: 'OAuth 2.0 (Org-Account)', status: 'pending', icon: '📁' },
  { id: 'conn-http',  name: 'HTTP (Generic REST)',      type: 'Premium',  auth: 'Bearer Token / Basic',    status: 'pending', icon: '🌐' },
  { id: 'conn-zd',    name: 'Zendesk',                 type: 'Premium',  auth: 'API Token / OAuth',       status: 'pending', icon: '🎫' },
]

// ── FRAGENKATALOG ─────────────────────────────────────────────
export const PA_FRAGENKATALOG = [
  {
    id: 'pa-fq-cat1',
    category: 'Technisch & Infrastruktur',
    priority: 'MUSS',
    items: [
      { id: 'pa-fq1', question: 'Welche Microsoft 365 Lizenz ist vorhanden (Business Standard, E3, E5)?', priority: 'MUSS', answer: '' },
      { id: 'pa-fq2', question: 'Ist Power Automate Premium bereits lizenziert oder muss nachgekauft werden?', priority: 'MUSS', answer: '' },
      { id: 'pa-fq3', question: 'Welche Power Platform Region soll genutzt werden (Europa/Deutschland/US)?', priority: 'MUSS', answer: '' },
      { id: 'pa-fq4', question: 'Gibt es restriktive DLP-Policies im Tenant die Connectors blockieren könnten?', priority: 'MUSS', answer: '' },
      { id: 'pa-fq5', question: 'Welche JTL-Version (Shop + WAWI) ist im Einsatz und ist die REST API aktiv?', priority: 'MUSS', answer: '' },
    ],
  },
  {
    id: 'pa-fq-cat2',
    category: 'Operations & Prozesse',
    priority: 'SOLLTE',
    items: [
      { id: 'pa-fq6', question: 'Welche Geschäftszeiten gelten (Mo–Fr, Samstag, Feiertage)?', priority: 'SOLLTE', answer: '' },
      { id: 'pa-fq7', question: 'Wer ist der zuständige IT-Admin / Power Platform Admin im Unternehmen?', priority: 'SOLLTE', answer: '' },
      { id: 'pa-fq8', question: 'Welche Teams-Channels sollen Benachrichtigungen empfangen?', priority: 'SOLLTE', answer: '' },
      { id: 'pa-fq9', question: 'Wie hoch ist das tägliche Bestellvolumen (relevant für API-Quota-Kalkulation)?', priority: 'SOLLTE', answer: '' },
      { id: 'pa-fq10', question: 'Wer ist Genehmiger für den Retouren-Approval-Flow?', priority: 'SOLLTE', answer: '' },
      { id: 'pa-fq11', question: 'Welche SLA-Zeiten gelten (Erste Antwort, Lösung) pro Priorität?', priority: 'SOLLTE', answer: '' },
    ],
  },
  {
    id: 'pa-fq-cat3',
    category: 'Lizenzen & Kosten',
    priority: 'MUSS',
    items: [
      { id: 'pa-fq12', question: 'Soll ein Service-Account für Flow-Ausführung genutzt werden (eine Lizenz für alle Flows)?', priority: 'MUSS', answer: '' },
      { id: 'pa-fq13', question: 'Werden Desktop Flows / RPA benötigt (Legacy-Systeme, Desktop-Anwendungen)?', priority: 'KANN', answer: '' },
      { id: 'pa-fq14', question: 'Soll AI Builder für Dokumentenerkennung (OCR, Rechnungen) eingesetzt werden?', priority: 'KANN', answer: '' },
    ],
  },
  {
    id: 'pa-fq-cat4',
    category: 'Zukunft & Skalierung',
    priority: 'KANN',
    items: [
      { id: 'pa-fq15', question: 'Welche weiteren Systeme sollen langfristig integriert werden (CRM, ERP, BI)?', priority: 'KANN', answer: '' },
      { id: 'pa-fq16', question: 'Ist eine Power Apps Frontend-App für Mitarbeiter geplant?', priority: 'KANN', answer: '' },
      { id: 'pa-fq17', question: 'Soll Power BI für Reporting und KPI-Dashboards genutzt werden?', priority: 'KANN', answer: '' },
      { id: 'pa-fq18', question: 'Ist Dataverse als zentrales Datenmodell für die Power Platform angedacht?', priority: 'KANN', answer: '' },
      { id: 'pa-fq19', question: 'Sind weitere Automationen für HR, Finance oder Lagerverwaltung geplant?', priority: 'KANN', answer: '' },
      { id: 'pa-fq20', question: 'Soll Microsoft Copilot (AI) in Power Automate genutzt werden?', priority: 'KANN', answer: '' },
    ],
  },
]

// ── FAQ ───────────────────────────────────────────────────────
export const PA_FAQ = [
  {
    question: 'Was ist Microsoft Power Automate genau?',
    answer: 'Power Automate ist Microsofts Cloud-Workflow-Engine: TRIGGER → AKTION → AKTION → ERGEBNIS. Es verbindet über 1.000 Apps und Dienste (Microsoft 365, JTL, Zendesk, SAP und mehr). Es ist Teil der Microsoft Power Platform zusammen mit Power Apps, Power BI und Dataverse. Flows laufen vollautomatisch oder auf Knopfdruck.',
  },
  {
    question: 'Welche vier Flow-Typen gibt es?',
    answer: '1) Cloud Flow (Automated) — wird durch ein Ereignis ausgelöst (neue E-Mail, Webhook). 2) Scheduled Flow — läuft zu festen Zeiten (täglich 07:00, stündlich). 3) Instant Flow — manuell per Teams, Mobile App oder Button. 4) Desktop Flow (RPA) — automatisiert Windows-Programme ohne API (z.B. Legacy-ERP, SAP-GUI). Wir nutzen hauptsächlich Typ 1 und 2.',
  },
  {
    question: 'Wie funktioniert die JTL-Integration?',
    answer: 'JTL hat keine offizielle Power Automate-App. Wir bauen einen Custom Connector via HTTP/Webhooks: JTL sendet bei Ereignissen (Bestellung, Retoure) einen Webhook an einen Power Automate HTTP-Trigger-Endpunkt. Power Automate empfängt die JSON-Payload und führt die konfigurierten Aktionen aus (Zendesk, Teams, SharePoint etc.).',
  },
  {
    question: 'Welche Microsoft 365 Lizenz wird mindestens benötigt?',
    answer: 'Standard-Connectors (Outlook, Teams, SharePoint) laufen mit jeder M365-Lizenz. Für Premium-Connectors (JTL Custom Connector, Zendesk, SAP, HTTP-Connector mit Authentifizierung) wird Power Automate Premium benötigt: ca. €15/User/Monat oder als Service-Account-Lizenz. Desktop Flows (RPA) erfordern Power Automate Premium + RPA (ca. €40/User/Monat).',
  },
  {
    question: 'Wie sicher sind die Flows — werden Kundendaten gespeichert?',
    answer: 'Power Automate verarbeitet Daten in Microsoft Azure (EU-Region wählbar). Daten werden in Flows nicht dauerhaft gespeichert, nur in Run-History (30 Tage, konfigurierbar). DLP-Policies im Tenant verhindern ungewollten Datentransfer. DSGVO-Compliance ist bei korrekter Tenant-Konfiguration (EU-Region) gewährleistet.',
  },
  {
    question: 'Was passiert wenn ein Flow fehlschlägt?',
    answer: 'Jeder Flow hat einen integrierten Error-Alert: Bei Fehler sendet F-Error eine E-Mail + Teams-Nachricht an den Admin. Im Power Automate Monitor ist die Run-History mit Fehlerdetails einsehbar. Für kritische Flows implementieren wir retry-Logik (automatische Wiederholung bei transienten Fehlern). Ein Rollback-Plan ist in der Schulung enthalten.',
  },
  {
    question: 'Wie lange dauert die Schulung?',
    answer: 'Die Admin-Schulung dauert 90 Minuten (Remote): Power Automate Grundlagen, eigene Flows erstellen/bearbeiten, Monitor + Run-History verstehen, Connector-Verbindungen pflegen, Debugging-Basics. Endnutzer erhalten einen 10-seitigen Quick-Guide für Instant Flows per Teams/Mobile. Alle Unterlagen werden in SharePoint abgelegt.',
  },
  {
    question: 'Kann Power Automate auch andere Systeme anbinden?',
    answer: 'Ja — über 1.000 fertige Connectors: Shopify, WooCommerce, Salesforce, HubSpot, SAP, Google Workspace, Slack und viele mehr. Jede REST-API kann über den HTTP-Connector oder Custom Connectors angebunden werden. Mittelfristig ist Power Automate der Knotenpunkt für die gesamte Microsoft Power Platform (Power Apps, Power BI, Dataverse).',
  },
]

// ── UPSELLS ──────────────────────────────────────────────────
export const PA_UPSELLS = [
  { id: 'pa-u1', title: 'Desktop Flows (RPA)', desc: 'Automatisierung von Legacy-Systemen ohne API (ERP-GUI, alte Web-Portale). Ideal wenn JTL-WAWI Desktop-Funktionen automatisiert werden sollen.', price: 'Ab €40/User/Mo.', icon: '🖥' },
  { id: 'pa-u2', title: 'AI Builder Integration', desc: 'Rechnungs-OCR, Dokumentenklassifizierung, Sentiment-Analyse von Kundenanfragen. Reduziert manuelle Dateneingabe drastisch.', price: '+€10/User/Mo.', icon: '🤖' },
  { id: 'pa-u3', title: 'Power Apps Frontend', desc: 'Eigene App für Mitarbeiter (Retouren-Erfassung, Statusabfragen) ohne Programmierung. Ergänzt die Flows mit einer mobilen Oberfläche.', price: 'Ab €5/User/Mo.', icon: '📱' },
  { id: 'pa-u4', title: 'Power BI Reporting', desc: 'KPI-Dashboards für Bestellvolumen, SLA-Einhaltung, Retouren-Quoten — live aus Zendesk + JTL. Management-Reporting auf Knopfdruck.', price: 'Ab €9/User/Mo.', icon: '📊' },
  { id: 'pa-u5', title: 'Dataverse als Datenhub', desc: 'Zentrales Datenmodell für die Power Platform. Ideal wenn mehrere Abteilungen (Support, Sales, Lager) aus denselben Daten arbeiten.', price: 'Individuelle Kalkulation', icon: '🗄' },
  { id: 'pa-u6', title: 'Erweiterung auf weitere Flows', desc: 'Aufbauend auf den 6 Basis-Flows: HR Onboarding, Finance-Automationen, Lieferanten-Management, Zeiterfassung.', price: 'Ab €80/h', icon: '⚡' },
]

// ── DEMO CHECKLISTE ──────────────────────────────────────────
export const PA_DEMO_CHECKLIST = [
  { id: 'pa-dc1', text: 'Dev-Umgebung mit Testdaten befüllt', done: false, blocking: true },
  { id: 'pa-dc2', text: 'JTL Test-Webhook feuert korrekt', done: false, blocking: true },
  { id: 'pa-dc3', text: 'F-01 Demo: Testbestellung → Teams-Karte sichtbar', done: false, blocking: true },
  { id: 'pa-dc4', text: 'F-02 Demo: Test-Retoure → Approval-Mail sichtbar', done: false, blocking: true },
  { id: 'pa-dc5', text: 'F-06 Demo: E-Mail außerhalb Zeiten → Auto-Reply', done: false, blocking: false },
  { id: 'pa-dc6', text: 'Power Automate Monitor geöffnet, Run-History erklärbar', done: false, blocking: false },
  { id: 'pa-dc7', text: 'Fehler-Simulation: Webhook-Payload kaputt → Error-Alert sichtbar', done: false, blocking: false },
  { id: 'pa-dc8', text: 'Präsentation vorbereitet (Architektur-Diagramm, ROI-Kalkulation)', done: false, blocking: false },
]

// ── DEMO MILESTONES ──────────────────────────────────────────
export const PA_DEMO_MILESTONES = [
  { id: 'pa-dm1', title: 'Kick-off & Analyse',        week: 'W1',   done: false, desc: 'Anforderungen, Lizenz-Check, Architektur-Entscheidung' },
  { id: 'pa-dm2', title: 'Umgebungen & Connectors',   week: 'W1–2', done: false, desc: 'Dev/Test/Prod angelegt, JTL + M365 Connectors verbunden' },
  { id: 'pa-dm3', title: 'Core Flows (F-01 bis F-04)',week: 'W2',   done: false, desc: 'Bestellung, Retoure, Eskalation, Report in DEV fertig' },
  { id: 'pa-dm4', title: 'F-05, F-06 + Error-Flows',  week: 'W2–3', done: false, desc: 'SLA-Warning, Außerhalb-Zeiten, Error-Alerts fertig' },
  { id: 'pa-dm5', title: 'Test & Qualitätssicherung', week: 'W3',   done: false, desc: 'End-to-End Tests in TEST-Umgebung, alle Szenarien durchgespielt' },
  { id: 'pa-dm6', title: 'Dokumentation & Schulung',  week: 'W3',   done: false, desc: 'Flow-Doku in SharePoint, Admin-Schulung 90 Min.' },
  { id: 'pa-dm7', title: 'Go-Live (PROD aktivieren)',  week: 'W3',   done: false, desc: 'Alle Flows in PROD aktiv, Monitor läuft, Hypercare startet' },
  { id: 'pa-dm8', title: 'Hypercare-Review',           week: 'W5',   done: false, desc: 'Performance-Review nach 2 Wochen, Feinabstimmung' },
]

// ── STANDARD CUSTOMER DATA FELDER FÜR PA-PROJEKTE ────────────
export const PA_CUSTOMER_DEFAULT = {
  name: '',
  short: '',
  url: '',
  email: '',
  hoster: '',
  markt: '',
  timezone: 'Berlin UTC+1/+2',
  volumen: '',
  m365Tenant: '',
  m365Plan: 'Microsoft 365 Business Standard',
  powerPlatformRegion: 'Europe',
  jtlShop: '',
  jtlWawi: '',
}
