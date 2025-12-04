export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  },
  
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/orders',
    useOrdersFile: process.env.USE_ORDERS_FILE === 'true', // true para usar JSON, false para MongoDB
  },
  
  environment: process.env.NODE_ENV || 'development',
});
