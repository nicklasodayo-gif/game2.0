import { z } from 'zod';

/**
 * Lead capture form validation schema
 */
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z
    .string()
    .min(9, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .regex(
      /^(\+?254|0)[17][0-9]{8}$/,
      'Please enter a valid Kenyan phone number'
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  consent: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms to continue'),
});

/**
 * Validate Kenyan phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidKenyanPhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const patterns = [
    /^(\+254|0)[17][0-9]{8}$/,  // Safaricom, Airtel
    /^(\+254|0)[1-9][0-9]{7}$/,  // Other networks
  ];
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Format Kenyan phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export function formatKenyanPhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+254')) {
    return cleaned;
  }
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  if (!email || email.trim() === '') return true; // Optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
export function isValidName(name) {
  if (!name || name.trim().length < 2) return false;
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name.trim());
}

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 500); // Limit length
}
