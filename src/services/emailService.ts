// src/services/emailService.ts
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

/**
 * Sends contact form data using EmailJS.
 * @param form - HTMLFormElement containing form fields.
 * @returns A Promise from EmailJS sendForm.
 */
export const sendContactEmail = (form: HTMLFormElement): Promise<unknown> => {
  return emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY);
};
