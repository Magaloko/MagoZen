// ─── HFK Zendesk Projekt · Dadakaev Labs ───────────────────────────────────

export const CUSTOMER = {
  name: 'Herr & Frau Klein GmbH',
  short: 'HFK',
  url: 'herrundfrauklein.com',
  email: 'service@herrundfrauklein.com',
  zendeskSubdomain: 'herrundfrauklein.zendesk.com',
  hoster: 'All-inkl',
  markt: 'Österreich (AT) + DE',
  timezone: 'Wien UTC+1/+2',
  sortiment: 'Mode, Spielzeug, Möbel, Tonies, Kinderwagen, Deko',
  volumen: '50–100 E-Mails/Tag',
  agenten: 6,
  aktuelleKanäle: 'Nur E-Mail',
  jtlShop: '5.4.2',
  jtlWawi: '1.9.4',
  branding: {
    primary: '#5C7A6A',
    primaryLight: '#EBF2EE',
    primaryMid: '#C8DDD3',
    cream: '#F8F4EE',
    warm: '#EDE5D8',
    ink: '#1C1F1D',
    gold: '#B8893A',
  },
}

export const KPIS = [
  { label: 'Honorar Techniker', value: '€2.880', sub: 'netto' },
  { label: 'Stundenaufwand', value: '36h', sub: '~€80/h' },
  { label: 'Phasen', value: '5+1', sub: 'inkl. Schulung' },
  { label: 'Go-Live', value: '4 Wo.', sub: 'ab Projektstart' },
  { label: 'Agenten', value: '6', sub: '4 Full + 2 Light' },
  { label: 'Lizenz/Mo.', value: '€690', sub: '6 Agenten' },
]

export const GRUPPEN = [
  { name: 'Mode & Rückgaben', agents: ['Agent 1', 'Agent 2'] },
  { name: 'Spielzeug & Tonies', agents: ['Agent 3', 'Agent 4'] },
  { name: 'Möbel & Lieferung', agents: ['Agent 5'] },
  { name: 'Allgemein', agents: ['Agent 6'] },
  { name: 'WhatsApp (inaktiv)', agents: [], inactive: true },
]

export const DNS_RECORDS = [
  {
    type: 'TXT (SPF)',
    host: '@',
    value: 'v=spf1 include:mail.zendesk.com ~all',
    note: 'Für E-Mail-Authentifizierung',
  },
  {
    type: 'TXT (DKIM 1)',
    host: 'zendesk1._domainkey',
    value: '[Wert aus Zendesk Admin Center kopieren]',
    note: 'Nach Zendesk-Account-Erstellung verfügbar',
    pending: true,
  },
  {
    type: 'TXT (DKIM 2)',
    host: 'zendesk2._domainkey',
    value: '[Wert aus Zendesk Admin Center kopieren]',
    note: 'Nach Zendesk-Account-Erstellung verfügbar',
    pending: true,
  },
]

export const PHASES = [
  {
    id: 'phase1',
    number: 'Phase 1',
    title: 'Zendesk Account Setup & Grundkonfiguration',
    hours: 8,
    color: 'green',
    honorar: 640,
    tasks: [
      {
        id: 'p1t1',
        title: 'Zendesk Account + Suite Professional',
        detail: 'Subdomain: herrundfrauklein.zendesk.com · 4–6 Agenten-Lizenzen · Billing klären',
      },
      {
        id: 'p1t2',
        title: 'Branding: Cream/Sage Design',
        detail: 'Logo Upload · #5C7A6A / #F8F4EE · E-Mail-Template HTML im HFK Design',
      },
      {
        id: 'p1t3',
        title: 'Sprache + Zeitzone + Geschäftszeiten',
        detail: 'Deutsch · Wien UTC+1/+2 · Mo–Fr 09:00–17:00 · AT-Feiertage eintragen',
      },
      {
        id: 'p1t4',
        title: '5 Custom Ticket-Felder anlegen',
        detail:
          'Bestellnummer (Text) · Retourengrund (Dropdown) · Tracking-Nr. (Text) · Bestellwert (Decimal) · Möbel-Sperrgut (Checkbox)',
      },
      {
        id: 'p1t5',
        title: '4 Gruppen anlegen + WhatsApp-Gruppe vorbereiten',
        detail:
          'Mode & Rückgaben · Spielzeug & Tonies · Möbel & Lieferung · Allgemein · WhatsApp (inaktiv)',
      },
      {
        id: 'p1t6',
        title: '6 Agenten anlegen + Gruppen zuweisen',
        detail: 'Rollen definieren · Light Agents für GF/Lager einrichten · Einladungen senden',
      },
    ],
  },
  {
    id: 'phase2',
    number: 'Phase 2',
    title: 'E-Mail Kanal + DNS (All-inkl)',
    hours: 4,
    color: 'blue',
    honorar: 0,
    tasks: [
      {
        id: 'p2t1',
        title: 'service@herrundfrauklein.com in Zendesk',
        detail:
          'Support-Adresse anlegen · Weiterleitung einrichten · Absender-Name: "Herr & Frau Klein Service"',
      },
      {
        id: 'p2t2',
        title: 'DNS-Records bei All-inkl eintragen',
        detail: 'SPF + 2x DKIM · Propagation prüfen: dnschecker.org · Typisch unter 30 Min.',
      },
      {
        id: 'p2t3',
        title: 'E-Mail-Test vollständig',
        detail: 'Senden + Empfangen + Ticket-Erstellung · Antwort aus Zendesk testen',
      },
      {
        id: 'p2t4',
        title: 'Eingangsbestätigung DE konfigurieren',
        detail:
          'Warmherziger Ton für Eltern-Zielgruppe · HFK Logo + Farben · "Wir antworten innerhalb von 8 Stunden"',
      },
    ],
  },
  {
    id: 'phase3',
    number: 'Phase 3',
    title: 'JTL Shop 5.4.2 + WAWI 1.9.4 Integration',
    hours: 10,
    color: 'amber',
    honorar: 800,
    risk: 'Möbel-Webhook hat anderen Statuspfad in WAWI 1.9.4 — Zeitpuffer einplanen!',
    tasks: [
      {
        id: 'p3t1',
        title: 'API-Benutzer in WAWI 1.9.4 anlegen',
        detail: 'Rechte: Bestellungen lesen + Kunden lesen + Artikel lesen · API-Key sichern',
      },
      {
        id: 'p3t2',
        title: 'REST API in JTL Shop 5.4.2 aktivieren',
        detail:
          'Plugin aktivieren · Endpoint: herrundfrauklein.com/api/v1 · SSL prüfen · Rate Limits prüfen',
      },
      {
        id: 'p3t3',
        title: 'Zendesk JTL App aus Marketplace installieren',
        detail: 'Apps & Integrations → Marketplace → "JTL" suchen · API Key + Shop URL · Verbindungstest',
      },
      {
        id: 'p3t4',
        title: 'Datenmapping konfigurieren',
        detail:
          'Reihenfolge: Bestellnr. · Status · Artikel-Liste · Tracking · Zahlungsstatus · Möbel-Flag',
      },
      {
        id: 'p3t5',
        title: 'Webhook: WAWI → Zendesk (4 Events)',
        detail:
          'Bestellbestätigung · Versandt + Tracking · Möbelliefertermin bestätigt · Retoure eingegangen · SEPARATE Logik für Möbel!',
      },
      {
        id: 'p3t6',
        title: 'Integrationstest mit echten Bestellungen',
        detail:
          'Test 1: Normalbestellung · Test 2: Möbellieferung · Test 3: Retoure-Prozess · Alle Custom Fields prüfen',
      },
    ],
  },
  {
    id: 'phase4',
    number: 'Phase 4',
    title: 'Automationen, SLA-Policies & Makros',
    hours: 8,
    color: 'green',
    honorar: 640,
    tasks: [
      {
        id: 'p4t1',
        title: 'SLA-Policy: Standard (8h/48h)',
        detail: 'Default · AT Geschäftszeiten Mo–Fr',
      },
      {
        id: 'p4t2',
        title: 'SLA-Policy: Dringend (1h/8h)',
        detail: 'Priorität = Urgent · Manuell oder via Trigger',
      },
      {
        id: 'p4t3',
        title: 'SLA-Policy: Möbel & Sperrgut (24h/72h)',
        detail: 'Custom Field: Möbel-Sperrgut = true als Bedingung',
      },
      {
        id: 'p4t4',
        title: 'Omnichannel Routing einrichten',
        detail: 'Highest Spare Capacity · 4 Gruppen aktiv',
      },
      {
        id: 'p4t5',
        title: '6 Makros erstellen (M-01 bis M-06)',
        detail: 'Versandbestätigung · Retoure · Möbelliefertermin · Größenberatung · Tonie defekt · Außerhalb GZ',
      },
      {
        id: 'p4t6',
        title: 'CSAT-Umfrage aktivieren',
        detail: 'Kundenzufriedenheitsumfrage nach Ticket-Lösung',
      },
      {
        id: 'p4t7',
        title: 'Views + Filter konfigurieren',
        detail: 'Ansichten für jede Gruppe · Offene Tickets · Wartezeit-Ansicht',
      },
    ],
  },
  {
    id: 'phase5',
    number: 'Phase 5',
    title: 'AI Copilot + Help Center',
    hours: 6,
    color: 'purple',
    honorar: 480,
    tasks: [
      {
        id: 'p5t1',
        title: 'AI Copilot aktivieren und konfigurieren',
        detail: 'Suggestions ON · Summarize ON · Expand ON · Tone Adjust ON · Auto-Answer OFF',
      },
      {
        id: 'p5t2',
        title: 'Help Center aufsetzen (6 Kategorien)',
        detail: 'Versand & Lieferung · Retouren · Möbel & Sperrgut · Tonies · Mode & Größen · Zahlungen',
      },
      {
        id: 'p5t3',
        title: '10 Help Center Artikel schreiben',
        detail: 'Nach Erhalt der Top-5 Anfragen von HFK — AUSSTEHEND',
        pending: true,
      },
      {
        id: 'p5t4',
        title: 'Copilot mit Help Center verbinden',
        detail: 'Help Center als Wissensquelle für KI-Vorschläge konfigurieren',
      },
      {
        id: 'p5t5',
        title: 'Copilot testen',
        detail: 'Test-Tickets erstellen · Qualität der KI-Vorschläge prüfen',
      },
    ],
  },
  {
    id: 'phase6',
    number: 'Schulung',
    title: 'Schulung, Dokumentation & 30 Tage Nachbetreuung',
    hours: 4,
    color: 'green',
    honorar: 320,
    tasks: [
      {
        id: 'p6t1',
        title: 'Remote-Schulung 90 Min. vorbereiten',
        detail: 'Agenda · Screensharing · Alle 6 Agenten gleichzeitig',
      },
      {
        id: 'p6t2',
        title: 'Kurzanleitung PDF erstellen',
        detail: 'Ticket bearbeiten · Makros nutzen · JTL-Daten lesen · Routing verstehen',
      },
      {
        id: 'p6t3',
        title: 'Remote-Schulung durchführen',
        detail: '90 Min. mit allen 6 Agenten · Fragen beantworten',
      },
      {
        id: 'p6t4',
        title: '30 Tage Nachbetreuung',
        detail: 'Verfügbar für Rückfragen · Anpassungen · Go-Live-Monitoring',
      },
    ],
  },
]

export const MACROS = [
  {
    id: 'M-01',
    name: 'Versandbestätigung',
    type: 'JTL',
    typeColor: 'green',
    description: 'Tracking-Link aus JTL · "{ticket.cf_tracking_nr}" · Lieferfenster erwähnen · Freundlicher Ton',
    template: `Liebe/r {{ticket.requester.first_name}},

Ihre Bestellung ist auf dem Weg zu Ihnen!

📦 Ihre Sendungsnummer: {{ticket.cf_tracking_nr}}
📅 Voraussichtliche Lieferung: 2–4 Werktage

Über den Tracking-Link können Sie Ihre Bestellung jederzeit verfolgen.

Wir wünschen viel Freude mit Ihrem Einkauf!
Mit freundlichen Grüßen
Ihr Herr & Frau Klein Service-Team`,
  },
  {
    id: 'M-02',
    name: 'Retoure einleiten',
    type: 'Manual',
    typeColor: 'amber',
    description: 'Retourenformular-Link · Bestellnr. aus JTL · AT/DE Rücksende-Adresse · 14-Tage-Frist',
    template: `Liebe/r {{ticket.requester.first_name}},

natürlich helfen wir Ihnen bei der Rücksendung.

Ihre Bestellnummer: {{ticket.cf_bestellnummer}}

So gehen Sie vor:
1. Füllen Sie unser Retourenformular aus: [LINK]
2. Drucken Sie das Rücksendeetikett aus
3. Bitte senden Sie die Ware innerhalb von 14 Tagen zurück

Rücksende-Adresse:
Herr & Frau Klein GmbH
[ADRESSE EINTRAGEN]

Bei Fragen stehen wir jederzeit zur Verfügung.
Ihr Herr & Frau Klein Service-Team`,
  },
  {
    id: 'M-03',
    name: 'Möbelliefertermin',
    type: 'Webhook',
    typeColor: 'amber',
    description: 'Liefertermin aus JTL Webhook · Sperrgut-Hinweis · Annahme-Info · 24h SLA aktiv',
    template: `Liebe/r {{ticket.requester.first_name}},

Ihr Möbelstück ist in Kürze bei Ihnen!

📅 Ihr Liefertermin: {{ticket.cf_liefertermin}}

Wichtige Informationen zur Lieferung:
• Bitte stellen Sie sicher, dass jemand für die Annahme anwesend ist
• Bei Sperrgut ist ein Helfer zur Abnahme empfohlen
• Bei Problemen am Liefertag: Bitte direkt an uns wenden

Wir freuen uns, Ihnen schon bald Ihr neues Möbelstück liefern zu dürfen!
Ihr Herr & Frau Klein Service-Team`,
  },
  {
    id: 'M-04',
    name: 'Größenberatung → Copilot',
    type: 'AI',
    typeColor: 'blue',
    description: 'Copilot aus Help Center · Größentabellen für Mode · Link zur HFK Größenhilfe',
    template: `Liebe/r {{ticket.requester.first_name}},

gerne helfen wir Ihnen bei der Größenauswahl!

[AI Copilot fügt hier automatisch den passenden Inhalt aus unserer Größentabelle ein]

Unsere vollständige Größenhilfe finden Sie auch auf: herrundfrauklein.com/groessentabelle

Falls Sie noch weitere Fragen haben, stehen wir gerne zur Verfügung!
Ihr Herr & Frau Klein Service-Team`,
  },
  {
    id: 'M-05',
    name: 'Tonie defekt',
    type: 'Manual',
    typeColor: 'green',
    description: 'Defekt-Check 3 Fragen · Tonies Support Link · Ersatzlieferung wenn im Garantiefenster',
    template: `Liebe/r {{ticket.requester.first_name}},

es tut uns sehr leid zu hören, dass Ihr Tonie nicht funktioniert!

Um Ihnen schnell helfen zu können, bitte ich um folgende Informationen:
1. Welches Modell ist Ihr Tonie? (Name/Farbe)
2. Was genau passiert? (Kein Ton, keine Reaktion, blinkt seltsam...)
3. Wann wurde der Tonie gekauft?

Alternativ können Sie auch direkt den Tonies Kundendienst kontaktieren: support.tonies.com

Sobald wir Ihre Antwort haben, finden wir gemeinsam eine Lösung!
Ihr Herr & Frau Klein Service-Team`,
  },
  {
    id: 'M-06',
    name: 'Außerhalb Geschäftszeiten',
    type: 'Auto',
    typeColor: 'amber',
    description: 'Automation: Mo–Fr <09:00 oder >17:00 · Wochenende · Nächster Werktag',
    template: `Liebe/r {{ticket.requester.first_name}},

vielen Dank für Ihre Nachricht!

Unsere Servicezeiten sind Montag bis Freitag, 09:00–17:00 Uhr.

Wir haben Ihre Anfrage erhalten und werden uns am nächsten Werktag bei Ihnen melden.

Mit freundlichen Grüßen
Ihr Herr & Frau Klein Service-Team`,
  },
]

export const SLA_POLICIES = [
  {
    name: 'Standard',
    firstResponse: '8h',
    resolution: '48h',
    condition: 'Default · AT Geschäftszeiten Mo–Fr',
  },
  {
    name: 'Dringend',
    firstResponse: '1h',
    resolution: '8h',
    condition: 'Priorität = Urgent · Manuell oder Trigger',
  },
  {
    name: 'Möbel & Sperrgut',
    firstResponse: '24h',
    resolution: '72h',
    condition: 'Custom Field: Möbel-Sperrgut = true',
  },
]

export const COPILOT_SETTINGS = [
  { feature: 'Auto-Answer', value: 'OFF', reason: 'Zu früh — erst nach 2 Monaten Betrieb evaluieren', active: false },
  { feature: 'Copilot Suggestions', value: 'ON', reason: 'KI schlägt Antwort vor · Agent prüft + sendet', active: true },
  { feature: 'Summarize', value: 'ON', reason: 'Lange Ticket-Historien zusammenfassen', active: true },
  { feature: 'Expand', value: 'ON', reason: 'Kurze Notizen zu vollständiger Antwort ausbauen', active: true },
  { feature: 'Tone Adjust', value: 'ON', reason: 'Formell/informell anpassen für AT-Kunden', active: true },
  { feature: 'Help Center Quelle', value: 'ON', reason: 'Copilot nutzt eigene Wissensbasis', active: true },
]

export const RISKS = [
  {
    level: 'hoch',
    title: 'Möbel-Webhook (WAWI 1.9.4)',
    description:
      'Möbellieferungen nutzen anderen Statuspfad in WAWI. Separate Webhook-Logik mit Artikel-Kategorie-Condition nötig. Zeitpuffer in Phase 3 einplanen (+2h).',
  },
  {
    level: 'mittel',
    title: 'Top-5 Anfragen ausstehend',
    description:
      'Makros (Phase 4) und Help Center (Phase 5) hängen davon ab. Spätestens zu Projektstart von HFK anfordern.',
  },
  {
    level: 'mittel',
    title: 'All-inkl Zugangsdaten',
    description:
      'Für DNS-Setup benötigt. 10 Minuten Arbeit. Danach Zugang sofort sperren/ändern.',
  },
  {
    level: 'niedrig',
    title: 'JTL Versionen bestätigt',
    description:
      'Shop 5.4.2 + WAWI 1.9.4 sind aktuell und vollständig kompatibel. REST API + Webhooks vorhanden. Kein Update nötig.',
  },
  {
    level: 'niedrig',
    title: 'All-inkl DNS',
    description:
      'Stabile Propagation, klares Interface. Typisch unter 30 Min. Kein Strato/1&1-Risiko.',
  },
  {
    level: 'niedrig',
    title: 'WhatsApp-Aktivierung',
    description:
      'Struktur wird in Phase 1 vorbereitet. Wenn HFK bereit: Aktivierung ohne Umbau möglich. Gutes Upsell-Argument nach 2–3 Monaten.',
  },
]

export const GOLIVELISTE = [
  { id: 'gl01', title: 'Zendesk Account aktiv und getestet', sub: '✓ Suite Professional · 6 Agenten eingeloggt' },
  { id: 'gl02', title: 'E-Mail-Kanal vollständig', sub: '✓ SPF + DKIM · Senden + Empfangen getestet' },
  { id: 'gl03', title: 'JTL Integration getestet', sub: '✓ Normal · Möbel · Retoure durchgespielt' },
  { id: 'gl04', title: 'Alle 3 SLA-Policies aktiv', sub: '✓ Standard · Dringend · Möbel/Sperrgut' },
  { id: 'gl05', title: 'Alle 6 Makros funktionsfähig', sub: '✓ M-01 bis M-06 getestet' },
  { id: 'gl06', title: 'Omnichannel Routing aktiv', sub: '✓ Highest Spare Capacity · 4 Gruppen' },
  { id: 'gl07', title: 'Copilot aktiviert (Auto-Answer OFF)', sub: '✓ Suggestions · Summarize · Expand · Tone' },
  { id: 'gl08', title: 'Help Center published', sub: '✓ 10 Artikel · 6 Kategorien · DE' },
  { id: 'gl09', title: 'Schulung abgehalten', sub: '✓ Alle 6 Agenten · 90 Min. Remote' },
  { id: 'gl10', title: 'Kurzanleitung versendet', sub: '✓ PDF an alle 6 Agenten' },
  { id: 'gl11', title: 'Top-5 Anfragen von HFK erhalten', sub: '⚠ AUSSTEHEND — Projektstart-Voraussetzung', pending: true },
  { id: 'gl12', title: 'All-inkl Zugangsdaten erhalten', sub: '⚠ AUSSTEHEND — Phase 2 Voraussetzung', pending: true },
]

export const FAQ_HFK = [
  {
    q: 'Warum brauchen wir das? Outlook reicht doch.',
    a: 'Outlook ist kein Ticketsystem. Bei 50–100 E-Mails täglich und 6 Mitarbeitern gibt es keine Zuweisung, kein SLA, keine JTL-Integration, keine KI und kein Reporting. Anfragen werden doppelt beantwortet oder vergessen, Bestelldaten müssen manuell nachgeschlagen werden. Zendesk löst alle diese Probleme — mit einem System das Ihr Team in einem Tag lernt.',
    tip: 'Frage zurückstellen: "Wie lange sucht Ihr Team heute im Schnitt nach Bestelldaten pro Anfrage?"',
  },
  {
    q: 'Was kostet Zendesk monatlich?',
    a: 'Zendesk zahlen Sie direkt — unabhängig von unserem Projektpreis. Suite Professional mit 6 Volllizenzen: €690/Mo. Mit Light Agents für GF und Lager (4 Full + 2 Light): €460/Mo. Die KI (Copilot) ist als Add-on optional — ca. €50/Agent.',
    tip: 'Lizenz-Optimierung als Mehrwert positionieren — HFK spart €2.760/Jahr durch 4 Full + 2 Light statt 6 Volllizenzen.',
  },
  {
    q: 'Wie lange dauert die Einrichtung?',
    a: '4 Wochen von Projektstart bis Go-Live. 5 Phasen: Setup → E-Mail/DNS → JTL-Integration → Automationen → KI/Schulung. Ich brauche nur zwei Dinge von Ihnen: Liste Ihrer Top-5 Anfragen + kurzzeitiger All-inkl-Zugang für DNS.',
    tip: 'Konkrete Folgefrage: "Wann können wir starten? Ich reserviere den Slot für Sie."',
  },
  {
    q: 'Muss unser Team viel lernen?',
    a: 'Nein — Zendesk wurde gebaut damit Support-Teams es einfach nutzen können. Ich schule alle 6 Mitarbeiter in 90 Minuten remote gleichzeitig. Danach gibt es eine Kurzanleitung. Die meisten Agenten sind nach 1–2 Tagen vollständig selbstständig.',
    tip: 'Konkret: "Vergleichbar mit der Zeit die Sie gebraucht haben um JTL zu lernen — aber deutlich einfacher."',
  },
  {
    q: 'Was ist mit DSGVO?',
    a: 'Zendesk nutzt EU-Rechenzentren (Frankfurt). Auftragsverarbeitungsvertrag (AVV) mit Zendesk ist Standard. Ihre Kundendaten verlassen die EU nicht. Ich unterstütze beim korrekten Setup aller DSGVO-Einstellungen.',
    tip: '"Zendesk hat die höchsten Compliance-Zertifizierungen für EU-Kunden."',
  },
  {
    q: 'Wir haben Möbel mit langen Lieferzeiten — kann das System damit umgehen?',
    a: 'Genau dafür habe ich eine spezielle Konfiguration: eigene SLA-Policy für Möbel (24h/72h statt Standard 8h/48h), eigene Routing-Gruppe "Möbel & Lieferung" und einen dedizierten Webhook der Liefertermin-Bestätigungen aus JTL direkt ins Ticket schreibt.',
    tip: 'Das zeigt dass der Shop wirklich analysiert wurde — starkes Vertrauenssignal.',
  },
  {
    q: 'Was wenn JTL ein Update macht und die Integration bricht?',
    a: 'Die JTL App im Zendesk Marketplace wird für alle aktuellen JTL-Versionen aktualisiert. Bei kritischen Updates würde ich im Rahmen der 30 Tage Nachbetreuung reagieren. Langfristig empfehle ich einen Betreuungsvertrag.',
    tip: 'Gute Gelegenheit Betreuungsvertrag zu erwähnen.',
  },
  {
    q: 'Wir haben gehört dass Zendesk teuer und kompliziert ist.',
    a: 'Das stimmt für Enterprise-Pakete — nicht für Suite Professional. Suite Professional ist genau für Shops Ihrer Größe gebaut. Und "kompliziert" bezieht sich auf selbst-einrichten. Wir richten alles ein, schulen Ihr Team und Sie starten direkt produktiv.',
    tip: 'Freshdesk hätte keine native JTL-App — zeigt Kompetenz.',
  },
]

export const LIZENZEN = [
  { rolle: '6 aktive Support-Agenten', typ: 'Suite Professional Full Agent', kosten: '6 × €115 = €690/Mo.', hinweis: 'Vollzugriff, Antworten, Tickets' },
  { rolle: 'GF / Geschäftsführung', typ: 'Light Agent (kostenlos)', kosten: '€0', hinweis: 'Lesen + interne Kommentare' },
  { rolle: 'Lagerleiter / Logistik', typ: 'Light Agent (kostenlos)', kosten: '€0', hinweis: 'Lesen + interne Kommentare' },
  { rolle: 'Verwaltung / Einkauf', typ: 'Light Agent (kostenlos)', kosten: '€0', hinweis: 'Suite Professional: Light Agents inklusive' },
]

export const UPSELLS = [
  { icon: '📱', title: 'WhatsApp-Kanal', description: 'Struktur ist vorbereitet. Aktivierung dauert ~1 Tag. Perfekter Einstieg nach 2–3 Monaten.', preis: '~€600–800 einmalig' },
  { icon: '💬', title: 'Live Chat', description: 'Chat-Widget auf herrundfrauklein.com. Agenten sehen alles an einem Ort.', preis: '~€500–700 einmalig' },
  { icon: '🔄', title: 'Betreuungsvertrag', description: 'Monatliche Pflege: Makros aktualisieren, Berichte, Help Center erweitern, Prioritätssupport.', preis: '€150–350/Mo. recurring' },
  { icon: '📊', title: 'Analytics Dashboard', description: 'Custom Zendesk Explore Dashboards: Volumen, SLA-Compliance, Agenten-Performance, CSAT-Trends.', preis: '~€400–600 einmalig' },
  { icon: '🏪', title: 'Zweiter Standort / Shop', description: 'Falls HFK expandiert. Gleiche Struktur, neues Branding, schneller Setup.', preis: '~€1.500–2.000 einmalig' },
  { icon: '🤖', title: 'Copilot-Erweiterung', description: 'Mehr Help Center Artikel, bessere KI-Antworten, Auto-Answer für einfache Anfragen.', preis: '~€300–500 einmalig' },
]

// ─── FRAGENKATALOG ───────────────────────────────────────────────────────────
// 24 Fragen: 7× MUSS · 9× SOLLTE · 8× KANN
// Quelle: 04_HFK_Fragenkatalog.html

export const FRAGENKATALOG = [
  {
    kategorie: 'Technische Infrastruktur',
    id: 'tech',
    icon: '🛠',
    color: 'green',
    fragen: [
      {
        id: 'T-01',
        prio: 'MUSS',
        text: 'Wie lautet Ihr All-inkl Benutzername / Login für das DNS-Panel?',
        why: 'Für DNS-Records (SPF + DKIM) benötigt. Phase 2 ist ohne diesen Zugang nicht möglich. Kurzzugang reicht — 10 Minuten Arbeit, danach sofort sperren/ändern.',
        tip: 'Kommunizieren: "Ich trage 3 Einträge ein und benötige den Zugang maximal 30 Minuten."',
      },
      {
        id: 'T-02',
        prio: 'MUSS',
        text: 'Haben Sie Zugang zum JTL WAWI Backend? Wer ist der WAWI-Administrator?',
        why: 'Ich lege selbst den API-Benutzer in WAWI 1.9.4 an. Dafür brauche ich entweder Admin-Zugang oder muss jemanden bei HFK durch den Prozess führen.',
        tip: 'Wenn kein eigener Zugang: Wer beim Kunden hat Admin-Rechte in WAWI? 30 Min. gemeinsam via TeamViewer/Zoom.',
      },
      {
        id: 'T-03',
        prio: 'MUSS',
        text: 'Ist das JTL Shop REST API-Plugin bereits aktiviert? Läuft HTTPS auf dem Shop?',
        why: 'REST API Endpoint (herrundfrauklein.com/api/v1) muss erreichbar und SSL-gesichert sein. Falls nicht aktiviert: brauche ich Shop-Admin-Zugang oder Anleitung an HFK-IT.',
        tip: null,
      },
      {
        id: 'T-04',
        prio: 'SOLLTE',
        text: 'Gibt es eine separate IT-Person oder betreut jemand intern JTL + den Shop?',
        why: 'Bei technischen Rückfragen (API-Aktivierung, WAWI-Zugang) ist es wichtig zu wissen ob ich direkt mit der GF spreche oder es einen IT-Ansprechpartner gibt.',
        tip: null,
      },
      {
        id: 'T-05',
        prio: 'SOLLTE',
        text: 'Welche E-Mail-Clients nutzen Ihre Mitarbeiter heute (Outlook, Gmail, Apple Mail)?',
        why: 'Bestimmt ob Weiterleitungsregeln aus altem System nötig sind und wie der Übergang von bisherigen Mails zu Zendesk kommuniziert werden soll.',
        tip: null,
      },
      {
        id: 'T-06',
        prio: 'KANN',
        text: 'Gibt es weitere E-Mail-Adressen außer service@ (z.B. info@, returns@)?',
        why: 'Falls ja, können diese als sekundäre Support-Adressen in Zendesk eingebunden werden. Nicht zwingend, aber ein potenzieller Quick-Win.',
        tip: null,
      },
      {
        id: 'T-07',
        prio: 'KANN',
        text: 'Nutzen Sie einen separaten Retourenmanager (z.B. Returnbird, Narvar) oder alles über JTL?',
        why: 'Wenn externes Retouren-Tool im Einsatz: evtl. Webhook-Integration oder Link im Makro notwendig statt direktem JTL-Status.',
        tip: null,
      },
    ],
  },
  {
    kategorie: 'Support-Betrieb & Team',
    id: 'ops',
    icon: '📬',
    color: 'amber',
    fragen: [
      {
        id: 'O-01',
        prio: 'MUSS',
        text: 'Was sind Ihre 5 häufigsten Kundenanfragen? (Liste reicht, keine Details nötig)',
        why: 'Direkte Auswirkung auf Makros (Phase 4) und Help Center Artikel (Phase 5). Ohne diese Liste entstehen nur generische Vorlagen statt HFK-spezifischer Schnellantworten.',
        tip: 'Beispiel-Format: "1. Wo ist meine Bestellung? 2. Wie retourniere ich? 3. Tonie funktioniert nicht..." — fertig.',
      },
      {
        id: 'O-02',
        prio: 'MUSS',
        text: 'Wer sind die 6 Support-Agenten? Namen + E-Mail-Adressen + welche Produktgruppe?',
        why: 'Für Zendesk-Account-Erstellung, Gruppen-Zuweisung und Routing-Konfiguration. Ideal auch: wer ist der Zendesk-Admin (mein Ansprechpartner für Zugangsdaten)?',
        tip: null,
      },
      {
        id: 'O-03',
        prio: 'MUSS',
        text: 'Welche genauen Geschäftszeiten hat Ihr Support-Team? Gibt es Abweichungen von Mo–Fr 09–17?',
        why: 'Direkte Auswirkung auf SLA-Berechnung (nur Businesshours zählen) und den Außerhalb-Geschäftszeiten-Makro (M-06). Falsch konfiguriert = falsche SLA-Warnungen.',
        tip: null,
      },
      {
        id: 'O-04',
        prio: 'SOLLTE',
        text: 'Gibt es aktuell offene Anfragen / E-Mails die beim Go-Live migriert werden sollen?',
        why: 'Falls ja: Migration alter E-Mails als offene Tickets besprechen. Wenn nicht gewünscht: sauberer Cut-Off-Datum definieren ab dem Zendesk alle neuen Anfragen empfängt.',
        tip: null,
      },
      {
        id: 'O-05',
        prio: 'SOLLTE',
        text: 'Gibt es saisonale Spitzen (Weihnachten, Black Friday, Schulanfang)? Wann ist die Hochsaison?',
        why: 'Wichtig für Zeitplanung des Go-Live. Nicht in Hochsaison live gehen. Und: CSAT-Automation und SLA-Puffer sollten in Hochsaison angepasst werden.',
        tip: 'Empfehlung: Go-Live mindestens 4 Wochen vor Hochsaison abschließen.',
      },
      {
        id: 'O-06',
        prio: 'SOLLTE',
        text: 'Wie hoch ist der Anteil an deutschen vs. österreichischen Kunden? Gibt es Schweiz (CH)?',
        why: 'Beeinflusst Makro-Texte (AT vs. DE Anrede), Retourenadressen, Versandhinweise und evtl. Mehrwertsteuer-Kommunikation in Templates.',
        tip: null,
      },
      {
        id: 'O-07',
        prio: 'SOLLTE',
        text: 'Gibt es bereits Muster-E-Mails oder Textvorlagen die Ihr Team heute nutzt?',
        why: 'Goldgrube für Makro-Erstellung. Wenn HFK bereits gute Antworten hat, übernehme ich diese — das spart Zeit und Makros klingen authentisch nach HFK-Stimme.',
        tip: 'Bitte: 2–3 typische Antwort-E-Mails als Beispiel zusenden.',
      },
      {
        id: 'O-08',
        prio: 'KANN',
        text: 'Gibt es besondere Situationen die Eskalationen erfordern? (z.B. Beschädigungen, Beschwerden über Lieferanten)',
        why: 'Für eine optionale Eskalations-Routing-Regel oder einen "Dringend"-Trigger. Nicht zwingend für Phase 1, aber gut zu wissen für Phase 4.',
        tip: null,
      },
    ],
  },
  {
    kategorie: 'Marke, Inhalte & Kommunikation',
    id: 'brand',
    icon: '🏷',
    color: 'blue',
    fragen: [
      {
        id: 'B-01',
        prio: 'MUSS',
        text: 'Können Sie mir Ihr Logo als PNG oder SVG-Datei zusenden? (Ideal: Weiß auf transparent)',
        why: 'Für E-Mail-Template-Branding in Zendesk. Ohne Logo-Datei kann kein professionelles HFK-Template erstellt werden — Platzhalter sieht unprofessionell aus.',
        tip: null,
      },
      {
        id: 'B-02',
        prio: 'SOLLTE',
        text: 'Haben Sie eine Retourenrichtlinie? Wie lange ist die Rückgabefrist?',
        why: 'Zentral für Makro M-02 (Retoure einleiten) und den Help Center Artikel "Retouren & Rückgaben". Falsche Informationen hier sind rechtlich kritisch.',
        tip: 'AT: Gesetzliches Minimum 14 Tage · Viele Shops bieten 30 Tage. Was bietet HFK?',
      },
      {
        id: 'B-03',
        prio: 'SOLLTE',
        text: 'Welche Versanddienstleister nutzen Sie? (DPD, DHL, GLS, Österreich Post?) Gibt es einen für Möbel/Sperrgut?',
        why: 'Für Makro M-01 (Versandbestätigung) und den Tracking-Link. DHL-Links sehen anders aus als DPD-Links. Möbel haben oft eigene Speditionen.',
        tip: null,
      },
      {
        id: 'B-04',
        prio: 'SOLLTE',
        text: 'Gibt es eine bevorzugte Ansprache für Kundenkommunikation? (Sie/Du? Förmlich oder familiär?)',
        why: 'Alle Makros, E-Mail-Templates und Help Center Artikel müssen in derselben Stimme geschrieben sein wie HFK sonst kommuniziert. Tone of Voice ist Markenkern.',
        tip: null,
      },
      {
        id: 'B-05',
        prio: 'KANN',
        text: 'Gibt es bereits eine FAQ-Seite oder Hilfethemen auf der Website?',
        why: 'Falls ja, kann ich diese als Basis für die 10 Help Center Artikel übernehmen statt von Null anzufangen. Spart Zeit und ist konsistent mit der Website.',
        tip: null,
      },
      {
        id: 'B-06',
        prio: 'KANN',
        text: 'Haben Sie eine Kundenzufriedenheitsumfrage (CSAT) bereits getestet oder Erfahrung damit?',
        why: 'Ich aktiviere CSAT automatisch nach Phase 4. Gut zu wissen ob HFK schon damit vertraut ist — dann kommuniziere ich den Rollout entsprechend.',
        tip: null,
      },
    ],
  },
  {
    kategorie: 'Zukunft & Erweiterungen',
    id: 'future',
    icon: '🚀',
    color: 'purple',
    fragen: [
      {
        id: 'F-01',
        prio: 'SOLLTE',
        text: 'Wann planen Sie WhatsApp als Support-Kanal einzuführen? Gibt es bereits eine WhatsApp Business Nummer?',
        why: 'Ich bereite die Struktur in Phase 1 vor. Je konkreter die Planung, desto besser die Vorbereitung. Meta Business Account wird vorab benötigt wenn WhatsApp absehbar kommt.',
        tip: 'Tipp für HFK: WhatsApp Business API über Meta einrichten dauert 2–4 Wochen. Jetzt beantragen.',
      },
      {
        id: 'F-02',
        prio: 'KANN',
        text: 'Ist ein Live-Chat auf der Website geplant? Wenn ja, welcher Zeitrahmen?',
        why: 'Zendesk Web Widget (Chat) ist in Suite Professional inklusive. Wenn HFK das wünscht, kann ich es im gleichen Projekt einrichten — kein separater Auftrag nötig.',
        tip: null,
      },
      {
        id: 'F-03',
        prio: 'KANN',
        text: 'Planen Sie in den nächsten 12 Monaten weitere Standorte, einen zweiten Shop oder Marktplatzerweiterung (Amazon, Zalando)?',
        why: 'Falls Marktplätze dazukommen: eigene E-Mail-Kanäle und Routing-Gruppen in Zendesk nötig. Jetzt wissen = bessere Architektur von Anfang an.',
        tip: null,
      },
      {
        id: 'F-04',
        prio: 'KANN',
        text: 'Haben Sie Interesse an monatlichen Performance-Reports (Volumen, SLA-Compliance, CSAT-Werte)?',
        why: 'Zendesk Explore (in Suite Professional inklusive) erlaubt detaillierte Dashboards. Wenn gewünscht: ich richte ein Custom Dashboard ein — guter Einstieg für einen Betreuungsvertrag.',
        tip: 'Upselling-Ansatz: "Monatlicher Report + Optimierungen für €X/Mo."',
      },
      {
        id: 'F-05',
        prio: 'KANN',
        text: 'Gibt es andere Tools die mit Zendesk verbunden werden sollten? (CRM, Newsletter, Buchhaltung?)',
        why: 'Zendesk hat 1.000+ Marketplace-Integrationen. Wenn HFK z.B. Mailchimp, HubSpot oder Pipedrive nutzt: einfache Verbindung möglich. Kann den Wert erheblich steigern.',
        tip: null,
      },
    ],
  },
]

// ─── Demo & Integration ──────────────────────────────────────────────────────

export const DEMO_CHECKLIST = [
  { id: 'd1', cat: 'zendesk', catLabel: 'Zendesk', title: 'Zendesk Trial-Account URL', desc: 'z.B. hfk-demo.zendesk.com — Kunde legt Trial-Account an (kostenlos, 14 Tage)', blocking: true },
  { id: 'd2', cat: 'zendesk', catLabel: 'Zendesk', title: 'Admin-Login (E-Mail + Passwort)', desc: 'Zugangsdaten für den Demo-Zendesk-Account zur Konfiguration', blocking: true },
  { id: 'd3', cat: 'jtl-shop', catLabel: 'JTL Shop', title: 'JTL-Shop URL', desc: 'Live-Shop oder Staging-URL (z.B. shop.herrundfrauklein.de)', blocking: true },
  { id: 'd4', cat: 'jtl-shop', catLabel: 'JTL Shop', title: 'JTL Shop REST API Token', desc: 'API-Token mit Lesezugriff auf Orders, Customers, Products — in JTL-Shop Backend erstellen', blocking: true },
  { id: 'd5', cat: 'jtl-wawi', catLabel: 'JTL WAWI', title: 'WAWI Server-URL / IP-Adresse', desc: 'IP oder Hostname des Servers auf dem JTL WAWI läuft (lokal oder Cloud)', blocking: true },
  { id: 'd6', cat: 'jtl-wawi', catLabel: 'JTL WAWI', title: 'WAWI REST API Port', desc: 'Standard: Port 8080 · Muss von außen (unserer IP) erreichbar sein · Firewall-Freigabe nötig', blocking: true },
  { id: 'd7', cat: 'jtl-wawi', catLabel: 'JTL WAWI', title: 'WAWI API-Benutzer + API-Key', desc: 'Benutzername und API-Key aus JTL WAWI Benutzerverwaltung für REST-Connector', blocking: true },
  { id: 'd8', cat: 'branding', catLabel: 'Branding', title: 'HFK Logo (PNG oder SVG)', desc: 'Mindestens 200px Breite · Für Zendesk Help Center und Widget-Design', blocking: false },
  { id: 'd9', cat: 'branding', catLabel: 'Branding', title: 'Markenfarben (HEX-Codes)', desc: 'Primärfarbe + Akzentfarbe für Zendesk Theme (bereits bekannt: #5C7A6A)', blocking: false },
  { id: 'd10', cat: 'email', catLabel: 'E-Mail / DNS', title: 'Support-E-Mail-Adresse', desc: 'z.B. support@herrundfrauklein.de — wird als Zendesk E-Mail-Kanal eingerichtet', blocking: true },
  { id: 'd11', cat: 'email', catLabel: 'E-Mail / DNS', title: 'DNS-Zugang (All-inkl Login)', desc: 'Für CNAME, SPF, DKIM Einträge · Ohne DNS kein E-Mail-Kanal möglich', blocking: true },
  { id: 'd12', cat: 'agents', catLabel: 'Team', title: 'Agentenliste (Name + E-Mail)', desc: 'Alle Support-Mitarbeiter die Zendesk-Zugang bekommen sollen', blocking: true },
  { id: 'd13', cat: 'agents', catLabel: 'Team', title: 'Testdaten in JTL vorhanden', desc: 'Min. 5 Kunden + 10 Bestellungen in JTL für Demo-Zwecke · Damit Integration live gezeigt werden kann', blocking: false },
]

export const DEMO_MILESTONES = [
  {
    id: 'm1', phase: 1, phaseLabel: 'Phase 1',
    title: 'Zendesk Trial aktivieren & Grundsetup',
    dauer: '1–2 Tage',
    typ: 'self',
    beschreibung: 'Trial-Account auf zendesk.com erstellen (14 Tage kostenlos), Subdomain konfigurieren, Branding eintragen, erste Agenten anlegen.',
    intern: null,
  },
  {
    id: 'm2', phase: 1, phaseLabel: 'Phase 1',
    title: 'Kundendaten + Zugangsdaten sammeln',
    dauer: '2–5 Tage',
    typ: 'third-party',
    beschreibung: 'Zendesk Demo-URL, JTL API-Keys, WAWI-Zugangsdaten, Agentenliste und Branding vom Kunden einsammeln.',
    intern: 'BLOCKIEREND — Realistisch 2–5 Werktage einplanen. Kunde muss IT-Abteilung oder JTL-Partner einbeziehen für API-Freischaltung. Immer freundlich nachfassen nach 24h ohne Rückmeldung.',
  },
  {
    id: 'm3', phase: 2, phaseLabel: 'Phase 2',
    title: 'JTL Shop REST API freischalten',
    dauer: '1–3 Tage',
    typ: 'third-party',
    beschreibung: 'In JTL Shop Admin: REST API aktivieren, API-Token mit Leserechten erstellen (Orders, Customers, Products, Stock).',
    intern: 'Kann Kunde selbst in JTL-Shop-Backend machen. Falls kein IT-Know-how: JTL-Partner oder JTL Support notwendig — JTL Ticket dauert 1–3 Werktage. Port 443 (HTTPS) muss offen sein.',
  },
  {
    id: 'm4', phase: 2, phaseLabel: 'Phase 2',
    title: 'JTL WAWI REST Connector einrichten',
    dauer: '1–4 Tage',
    typ: 'mixed',
    beschreibung: 'WAWI REST API aktivieren, Zendesk-App aus JTL Marketplace installieren, Firewall-Port freigeben, API-Benutzer anlegen.',
    intern: 'FIREWALLREGEL: Muss vom Kunden-IT freigegeben werden (Port 8080 oder custom). JTL Marketplace App ist kostenlos. Falls JTL-Partner involviert: +1–2 Tage Wartezeit. Häufiges Problem: WAWI läuft lokal ohne feste IP → VPN oder DynDNS nötig.',
  },
  {
    id: 'm5', phase: 3, phaseLabel: 'Phase 3',
    title: 'Zendesk konfigurieren (Gruppen, SLA, Trigger)',
    dauer: '1 Tag',
    typ: 'self',
    beschreibung: 'Routing-Gruppen anlegen, SLA-Policies setzen, Trigger und Automationen konfigurieren, Makros erstellen.',
    intern: null,
  },
  {
    id: 'm6', phase: 3, phaseLabel: 'Phase 3',
    title: 'Integration testen (JTL ↔ Zendesk)',
    dauer: '0.5 Tage',
    typ: 'self',
    beschreibung: 'API-Verbindung prüfen, Datenmapping testen, 3 Test-Tickets anlegen, Kundensuche über JTL-Kundendaten verifizieren.',
    intern: null,
  },
  {
    id: 'm7', phase: 3, phaseLabel: 'Phase 3',
    title: 'DNS & E-Mail Setup',
    dauer: '1–2 Tage',
    typ: 'mixed',
    beschreibung: 'CNAME, SPF, DKIM bei All-inkl eintragen — E-Mail-Kanal in Zendesk aktivieren und testen.',
    intern: 'DNS-Propagation: normalerweise <1h, maximal 48h. Ohne All-inkl-Zugang ist das komplett blockiert. Frühzeitig Zugangsdaten anfordern! DKIM und SPF müssen gesetzt sein damit E-Mails nicht als SPAM markiert werden.',
  },
  {
    id: 'm8', phase: 4, phaseLabel: 'Phase 4',
    title: 'Demo-Präsentation beim Kunden',
    dauer: '90 Min.',
    typ: 'self',
    beschreibung: 'Live-Demo mit echten JTL-Daten: Ticket anlegen via E-Mail, Kundensuche, Bestellstatus aus WAWI abrufen, Routing zeigen.',
    intern: null,
  },
]
