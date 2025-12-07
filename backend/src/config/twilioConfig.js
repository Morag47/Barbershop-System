import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let twilioClient = null;

if (accountSid && authToken) {
    twilioClient = twilio(accountSid, authToken);
    console.log('✅ Cliente de Twilio configurado correctamente');
} else {
    console.warn('⚠️  Credenciales de Twilio no configuradas');
}

export default twilioClient;
