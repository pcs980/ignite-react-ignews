import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const secret = req.headers['stripe-signature'];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            );

            break;
          default:
            console.log(`event type ${type} should be managed`);
            throw new Error(`Unhandled event: ${type}`);
        }
      } catch (error) {
        console.error('Webhook handler failed', error.message);
        return res.json({ error: error.message });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
};

/*
{
  "id": "evt_1VDIzrWVrZUtUpqcZKt4Y5A9",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1623107280,
  "data": {
    "object": {
      "id": "cs_test_b1hQX5aiypThCjUv0eJDYVOzEigO52W1TocGhKJsQ4XkZJYjdbnRjRKnTx",
      "object": "checkout.session",
      "allow_promotion_codes": true,
      "amount_subtotal": 990,
      "amount_total": 990,
      "billing_address_collection": "required",
      "cancel_url": "http://localhost:3000",
      "client_reference_id": null,
      "currency": "usd",
      "customer": "cus_JYcuVdjtZmLeZd",
      "customer_details": {
        "email": "paulocsmg@gmail.com",
        "tax_exempt": "none",
        "tax_ids": []
      },
      "customer_email": null,
      "livemode": false,
      "locale": null,
      "metadata": {},
      "mode": "subscription",
      "payment_intent": null,
      "payment_method_options": {},
      "payment_method_types": ["card"],
      "payment_status": "paid",
      "setup_intent": null,
      "shipping": null,
      "shipping_address_collection": null,
      "submit_type": null,
      "subscription": "sub_J41nsDh0eld7HY",
      "success_url": "http://localhost:3000/posts",
      "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
      }
    }
  },
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_926kHdZWwEHqnO",
    "idempotency_key": null
  },
  "type": "checkout.session.completed"
}
*/