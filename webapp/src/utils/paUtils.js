// ============================================================
//  Power Automate Plan Utils
// ============================================================

export const PA_PLAN_TIER = { free: 1, premium: 2, premiumRpa: 3, process: 4 }

export const PA_PLANS = [
  {
    id: 'free',
    name: 'M365 Inklusive (Free)',
    price: 0,
    tier: 1,
    priceModel: 'user',
    features: [
      'Standard-Connectors (Outlook, Teams, SharePoint)',
      '6.000 Flow-Ausführungen/Mo.',
      'Cloud-Flows (Automated, Scheduled, Instant)',
      'Kein Premium-Connector (kein JTL, kein HTTP-Auth)',
      'Power Automate Desktop (Basic)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium (Per User)',
    price: 15,
    tier: 2,
    highlight: true,
    priceModel: 'user',
    features: [
      'Alle Standard- und Premium-Connectors',
      'Unbegrenzte Cloud-Flow-Ausführungen',
      'JTL Custom Connector (HTTP)',
      'AI Builder Credits (5.000/Mo.)',
      'Power Automate Desktop (Attended, mit Aufsicht)',
      'Zendesk Premium Connector',
    ],
  },
  {
    id: 'premiumRpa',
    name: 'Premium + RPA',
    price: 40,
    tier: 3,
    priceModel: 'user',
    features: [
      'Alles aus Premium',
      'Attended RPA inklusive (Desktop Flows)',
      'UI-Automatisierung für Legacy-Systeme',
      'Power Automate Desktop — voller Funktionsumfang',
      'Ideal für JTL-WAWI Desktop-Automatisierung',
    ],
  },
  {
    id: 'process',
    name: 'Process (Per Flow)',
    price: 150,
    tier: 4,
    priceModel: 'process',
    features: [
      'Unattended RPA (läuft ohne Nutzer-Anmeldung)',
      'Pro Prozess / Bot lizenziert',
      'Hosted Machine (Azure-VM im Hintergrund)',
      '24/7 vollautomatische Ausführung',
      'Ideal für nächtliche Batch-Verarbeitung',
    ],
  },
]

export const PA_ADDON_PRICES = {
  aiBuilder: {
    label: 'AI Builder',
    desc: 'Rechnungs-OCR, Dokumentenklassifizierung, Sentiment-Analyse',
    pricePerUser: 10,
    requiresTier: 2,
  },
  rpaAttended: {
    label: 'RPA Attended (Add-on)',
    desc: 'Desktop-Flow-Ausführung mit Nutzer-Anmeldung (Legacy-Systeme)',
    pricePerUser: 15,
    requiresTier: 2,
  },
  hostedRpa: {
    label: 'Hosted RPA',
    desc: 'Azure-VM für unattended RPA — läuft auch ohne physischen PC',
    priceFlat: 100,
    requiresTier: 3,
  },
}

/**
 * Gibt die Plan-ID aus dem gespeicherten Plan-Namen zurück.
 */
export function getPAPlanId(planName) {
  if (!planName) return 'free'
  const lower = planName.toLowerCase()
  if (lower.includes('process')) return 'process'
  if (lower.includes('rpa') || lower.includes('premium + rpa')) return 'premiumRpa'
  if (lower.includes('premium')) return 'premium'
  return 'free'
}

/**
 * Prüft ob ein Task/Checklisten-Item im gewählten PA-Plan verfügbar ist.
 */
export function isTaskAvailablePA(task, planName) {
  const planId = getPAPlanId(planName)
  const required = task.available_from || 'free'
  return (PA_PLAN_TIER[required] || 1) <= (PA_PLAN_TIER[planId] || 1)
}

/**
 * Berechnet die monatlichen Kosten für ein PA-Projekt.
 *
 * @param {string}  planId        - 'free' | 'premium' | 'premiumRpa' | 'process'
 * @param {number}  usersCount    - Anzahl lizenzierter User (für Per-User-Pläne)
 * @param {number}  processCount  - Anzahl Prozesse/Bots (für Process-Plan)
 * @param {object}  addons        - { aiBuilder: bool, rpaAttended: bool, hostedRpa: bool }
 */
export function calcCostPA(planId, usersCount, processCount, addons = {}) {
  const plan = PA_PLANS.find((p) => p.id === planId) || PA_PLANS[0]

  let licenseMonthly = 0
  if (plan.priceModel === 'user') {
    licenseMonthly = usersCount * plan.price
  } else if (plan.priceModel === 'process') {
    licenseMonthly = processCount * plan.price
  }

  const aiBuilderMonthly = addons.aiBuilder && plan.tier >= PA_ADDON_PRICES.aiBuilder.requiresTier
    ? usersCount * PA_ADDON_PRICES.aiBuilder.pricePerUser
    : 0

  const rpaMonthly = addons.rpaAttended && plan.tier >= PA_ADDON_PRICES.rpaAttended.requiresTier
    ? usersCount * PA_ADDON_PRICES.rpaAttended.pricePerUser
    : 0

  const hostedRpaMonthly = addons.hostedRpa && plan.tier >= PA_ADDON_PRICES.hostedRpa.requiresTier
    ? PA_ADDON_PRICES.hostedRpa.priceFlat
    : 0

  const totalMonthly = licenseMonthly + aiBuilderMonthly + rpaMonthly + hostedRpaMonthly
  const totalYearly = totalMonthly * 12 * 0.8 // 20% Jahresrabatt

  return {
    plan,
    licenseMonthly,
    aiBuilderMonthly,
    rpaMonthly,
    hostedRpaMonthly,
    totalMonthly,
    totalYearly,
  }
}
