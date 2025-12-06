// /controllers/authController.js
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        // 201 Created
        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (error) {
        if (error.code === 11000) { // Error de clave duplicada (ej. email)
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message }); // 400 Bad Request
        }
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Se usa el mismo mensaje para no revelar si el email existe
            return res.status(401).json({ error: 'Credenciales inválidas.' }); // 401 Unauthorized
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
};