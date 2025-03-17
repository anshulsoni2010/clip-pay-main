import { Client, Environment, LogLevel, OrdersController, PaymentsController } from "@paypal/paypal-server-sdk"

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
  },
  environment:Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: {
      logBody: true
    },
    logResponse: {
      logHeaders: true
    }
  },
})

export default client


const paymentsController = new PaymentsController(client);
const orderController = new OrdersController(client);

export { paymentsController, orderController };