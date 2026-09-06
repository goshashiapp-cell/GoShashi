export const BUSINESS_CONFIG = {
  APP_NAME: 'GoShashi',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_CURRENCY_SYMBOL: '₹',
  DEFAULT_TIMEZONE: 'Asia/Kolkata',
  DEFAULT_CITY: 'Gurugram',
  DEFAULT_STATE: 'Haryana',

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,

  // Financial & Platform defaults
  DEFAULT_PLATFORM_FEE: 49.0, // in INR
  DEFAULT_TAX_RATE: 18.0, // 18% GST standard on services in India
  DEFAULT_COMMISSION_PERCENTAGE: 15.0, // 15% platform commission

  // Partner Matching Algorithm Weights (Must sum to 100%)
  PARTNER_MATCHING_WEIGHTS: {
    SKILL: 30,
    DISTANCE: 25,
    RATING: 20,
    AVAILABILITY: 15,
    COMPLETION_RATE: 10,
  },

  // Cancellation Policy
  CANCELLATION_RULES: {
    FREE_CANCELLATION_HOURS_BEFORE: 2,
    LATE_CANCELLATION_FEE: 149.0,
    VISIT_FEE_AFTER_ARRIVAL: 199.0,
  },

  // Service Scheduling Windows
  TIME_SLOTS: [
    { id: 'slot-09-11', label: '09:00 AM - 11:00 AM', start: '09:00', end: '11:00' },
    { id: 'slot-11-13', label: '11:00 AM - 01:00 PM', start: '11:00', end: '13:00' },
    { id: 'slot-13-15', label: '01:00 PM - 03:00 PM', start: '13:00', end: '15:00' },
    { id: 'slot-15-17', label: '03:00 PM - 05:00 PM', start: '15:00', end: '17:00' },
    { id: 'slot-17-19', label: '05:00 PM - 07:00 PM', start: '17:00', end: '19:00' },
  ],
};
