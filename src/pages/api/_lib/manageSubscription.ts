import { fauna, q } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_stripe_customer_id'), customerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    user_id: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription_id'),
              subscriptionId,
            )
          )
        ),
        { data: subscriptionData }
      )
    );
  }
}

/*
{
  id: 'sub_JeGSZSeYvR2OHq',
  object: 'subscription',
  application_fee_percent: null,
  billing_cycle_anchor: 1623370118,
  billing_thresholds: null,
  cancel_at: null,
  cancel_at_period_end: false,
  canceled_at: null,
  collection_method: 'charge_automatically',
  created: 1623370118,
  current_period_end: 1625962118,
  current_period_start: 1623370118,
  customer: 'cus_JcYZmujtZdLeVd',
  days_until_due: null,
  default_payment_method: 'pm_1J0xg0AVDWVUtUpqpMVfh1gl',
  default_source: null,
  default_tax_rates: [],
  discount: null,
  ended_at: null,
  items: {
    object: 'list',
    data: [ [Object] ],
    has_more: false,
    total_count: 1,
    url: '/v1/subscription_items?subscription=sub_JeGSZSeYvR2OHq'
  },
  latest_invoice: 'in_1J0xvOAVDWVUtUpqE0bhg8uc',
  livemode: false,
  metadata: {},
  next_pending_invoice_item_invoice: null,
  pause_collection: null,
  pending_invoice_item_interval: null,
  pending_setup_intent: null,
  pending_update: null,
  plan: {
    id: 'price_1IyMpGAVDWVUtUpqhfJfEetN',
    object: 'plan',
    active: true,
    aggregate_usage: null,
    amount: 990,
    amount_decimal: '990',
    billing_scheme: 'per_unit',
    created: 1622750854,
    currency: 'usd',
    interval: 'month',
    interval_count: 1,
    livemode: false,
    metadata: {},
    nickname: null,
    product: 'prod_JbZzcImj3icre7',
    tiers_mode: null,
    transform_usage: null,
    trial_period_days: null,
    usage_type: 'licensed'
  },
  quantity: 1,
  schedule: null,
  start_date: 1623370118,
  status: 'active',
  transfer_data: null,
  trial_end: null,
  trial_start: null
}
*/
