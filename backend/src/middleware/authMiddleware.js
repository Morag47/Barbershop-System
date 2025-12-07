import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    try {
        // Obtener token del header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(403).json({ error: 'Token inválido' });
    }
}
