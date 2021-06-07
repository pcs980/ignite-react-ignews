import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import packageJson from '../../package.json';

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'ig.news',
      version: packageJson.version,
    }
  }
);

export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  return stripeJs;
}