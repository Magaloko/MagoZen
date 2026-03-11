export const PLAN_TIER = { team: 1, growth: 2, professional: 3, enterprise: 4 }

export const ZENDESK_PLANS = [
  {
    id: 'team',
    name: 'Suite Team',
    price: 55,
    tier: 1,
    features: ['E-Mail, Chat, Voice', 'Help Center (1 Sprache)', 'Basis-Berichte', '1 Light Agent gratis'],
  },
  {
    id: 'growth',
    name: 'Suite Growth',
    price: 89,
    tier: 2,
    features: ['Alles aus Team', 'SLA-Policies', 'CSAT-Umfragen', 'Mehrsprachiger Help Center', '5 Light Agents gratis'],
  },
  {
    id: 'professional',
    name: 'Suite Professional',
    price: 115,
    tier: 3,
    highlight: true,
    features: ['Alles aus Growth', 'Omnichannel Routing', 'Skills-based Routing', 'AI Copilot (Add-on)', 'Unbegrenzt Light Agents', 'Custom Roles', 'Sandbox'],
  },
  {
    id: 'enterprise',
    name: 'Suite Enterprise',
    price: 169,
    tier: 4,
    features: ['Alles aus Professional', 'Erweiterte Sandbox', 'Custom Agent Roles', 'Data Locality', 'Enterprise SLA', '24/7 Priority Support'],
  },
]

export const ADDON_PRICES = {
  copilot:   { label: 'AI Copilot',      pricePerAgent: 50, requiresTier: 3 },
  jtl:       { label: 'JTL-Integration', priceFlat: 0,      requiresTier: 1 },
  whatsapp:  { label: 'WhatsApp',        priceFlat: 0,      requiresTier: 1 },
  livechat:  { label: 'Live Chat Plus',  priceFlat: 0,      requiresTier: 1 },
  shopify:   { label: 'Shopify',         priceFlat: 0,      requiresTier: 1 },
}

/**
 * Derives the plan id string from a display name like "Suite Professional"
 */
export function getPlanId(planName) {
  if (!planName) return 'team'
  const lower = planName.toLowerCase()
  if (lower.includes('enterprise'))   return 'enterprise'
  if (lower.includes('professional')) return 'professional'
  if (lower.includes('growth'))       return 'growth'
  return 'team'
}

/**
 * Returns true when the task/checklist item is available for the given plan.
 * Tasks without available_from are always available.
 */
export function isTaskAvailable(task, planName) {
  const planId  = getPlanId(planName)
  const required = task.available_from || 'team'
  return (PLAN_TIER[required] || 1) <= (PLAN_TIER[planId] || 1)
}

/**
 * Calculates monthly and yearly cost.
 * Light agents are free from Professional onward.
 */
export function calcCost(planId, agentsFull, agentsLight, addons = {}) {
  const plan = ZENDESK_PLANS.find((p) => p.id === planId) || ZENDESK_PLANS[0]
  const licenseMonthly = agentsFull * plan.price
  const lightFree      = plan.tier >= 3
  const copilotMonthly = addons.copilot ? agentsFull * ADDON_PRICES.copilot.pricePerAgent : 0
  const totalMonthly   = licenseMonthly + copilotMonthly
  const totalYearly    = totalMonthly * 12 * 0.8 // 20% annual discount

  // Savings from using Light agents instead of Full (only meaningful if tier < 3)
  const lightSavings = lightFree ? 0 : agentsLight * plan.price

  return { plan, licenseMonthly, copilotMonthly, totalMonthly, totalYearly, lightSavings, lightFree }
}
