const stripeApiKey = process.env.NEXT_STRIPE_SECRET_KEY
const stripe = require("stripe")(stripeApiKey);
import { supabase } from "../../../lib/supabaseClient";

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 300;
};

async function createSubscription(req, res) {
  const { items, stripeCustomerId } = req.body;
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: items
  });
}

// Create a PaymentIntent with the order amount and currency
async function createPaymentIntent(req, res) {
  const { items, user, stripeCustomerId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    customer: stripeCustomerId,
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    setup_future_usage: "off_session"
  });

  try {
    console.log("PAYMENT INTENT: ", paymentIntent)
    const { data, error } = await supabase
      .from('stripe')
      .insert([{
        user_id: user.id,
        receipt_email: user.email,
        stripe_client_secret: paymentIntent.client_secret,
        stripe_payment_intent_id: paymentIntent.id
      }])
    data && console.log(data)
    error && console.error(error)
  } catch (err) {
    console.error(err)
  } finally {
    createSubscription(req, res)
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return createPaymentIntent(req, res)
  } else {
    res.send("Something's not right. Check your query.").end()
  }
}