import fetch from "node-fetch"

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API = "https://api-m.sandbox.paypal.com" // Change to live API in production

async function getPayPalToken() {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  const data = await response.json()
  return data.access_token
}

export async function createPayPalInvoice({ email, name, amount, currency, transactionId }) {
    const accessToken = await getPayPalToken()
  
    const invoicePayload = {
      detail: {
        invoice_number: `INV-${transactionId}`,
        currency_code: currency,
        note: "Thank you for your payment.",
      },
      invoicer: {
        name: { given_name: "Your", surname: "Business" },
        email_address: "yourbusiness@example.com",
      },
      primary_recipients: [
        {
          billing_info: {
            name: { given_name: name.split(" ")[0], surname: name.split(" ")[1] || "" },
            email_address: email,
          },
        },
      ],
      items: [
        {
          name: "Payment",
          quantity: "1",
          unit_amount: { currency_code: currency, value: amount },
        },
      ],
    }
  
    // Create the invoice
    const response = await fetch(`${PAYPAL_API}/v2/invoicing/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoicePayload),
    })
  
    const invoiceData = await response.json()
    const invoiceId = invoiceData.id
  
    if (!invoiceId) {
      throw new Error("Failed to create PayPal Invoice")
    }
  
    // Send the invoice via PayPal
    await fetch(`${PAYPAL_API}/v2/invoicing/invoices/${invoiceId}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
  
    // Construct the correct invoice link
    return {
      id: invoiceId,
      link: `https://www.paypal.com/invoice/payerView/details/${invoiceId}`,
    }
  }
  