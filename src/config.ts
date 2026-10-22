/**
 * Centralized Store Configuration
 */

// Normalized contact number: 03126687237 -> 923126687237
export const STORE_CONFIG = {
  brandName: 'Khaalis Kitchen',
  tagline: 'Modern Culinary Essentials & Smart Kitchen Gadgets',
  rawPhone: '03126687237',
  whatsappNumber: '923126687237',
  email: 'support@khaaliskitchen.pk',
  freeShippingThreshold: 3500, // PKR
  standardShippingFee: 250, // PKR
  currencySymbol: 'PKR',
  returnPolicyDays: 7,
  defaultDeliveryEstimate: '3-5 Working Days across Pakistan',
};

/**
 * Format currency nicely with PKR
 */
export function formatPKR(amount: number): string {
  return `₨ ${amount.toLocaleString('en-PK')}`;
}

/**
 * Generate a WhatsApp Click-to-Chat URL with encoded prefilled message
 */
export function getWhatsAppUrl(message: string, customPhone?: string): string {
  const phone = customPhone || STORE_CONFIG.whatsappNumber;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Common Pakistani Cities for Checkout
 */
export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Sheikhupura',
  'Jhelum',
  'Mardan',
  'Gujrat',
  'Kasur',
  'Wah Cantt',
  'Other City',
];

/**
 * Valid promo discount codes
 */
export const PROMO_CODES: Record<string, number> = {
  KHAALIS10: 0.10, // 10% discount
  COOKING2026: 0.15, // 15% discount
  FIRSTORDER: 0.05, // 5% discount
};
