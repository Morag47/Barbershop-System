import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verificar configuración
transporter.verify()
    .then(() => {
        console.log('✅ Servidor de email configurado correctamente');
    })
    .catch(err => {
        console.error('❌ Error en la configuración de email:', err.message);
    });

export default transporter;
