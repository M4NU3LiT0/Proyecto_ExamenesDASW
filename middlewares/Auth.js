// /middlewares/auth.js
const jwt = require('jsonwebtoken');

// 1. Verificar si el token es válido y extraer el usuario
exports.verifyToken = (req, res, next) => {
    // El token se espera en el header como: Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Se requiere Token.' }); // 401 Unauthorized
    }
    
    const token = authHeader.replace('Bearer ', '');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Adjuntamos la información del usuario al request (ID y role)
        req.user = verified; 
        next();
    } catch (err) {
        // 400 Bad Request si el token es inválido (expirado o malformado)
        res.status(400).json({ error: 'Token inválido o expirado.' }); 
    }
};

// 2. Middleware para asegurar que el usuario es Teacher (Profesor)
exports.isTeacher = (req, res, next) => {
    // req.user viene del middleware verifyToken
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        // 403 Forbidden para acceso denegado por permisos
        res.status(403).json({ error: 'Permiso denegado. Se requiere rol de profesor.' }); 
    }
};

// 3. Middleware para asegurar que el usuario es Student (Estudiante)
exports.isStudent = (req, res, next) => {
    // req.user viene del middleware verifyToken
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        // 403 Forbidden para acceso denegado por permisos
        res.status(403).json({ error: 'Permiso denegado. Se requiere rol de estudiante.' }); 
    }
};
