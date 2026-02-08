import getDAO from '../daos/factory.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usersDao = getDAO('users');

const registerUser = async (req, res) => {
    const { email, password, name, address, phone } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, y nombre son obligatorios.' });
    }
    try {
        const existingUser = await usersDao.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Ya existe un usuario con ese email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hashear password
        const newUser = await usersDao.createUser({
            email,
            password: hashedPassword,
            name,
            address,
            phone
        });

        res.status(201).json({ message: 'Usuario registrado!', user: { id: newUser._id, email: newUser.email, name: newUser.name } });

    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y password son requeridos.' });
    }

    try {
        const user = await usersDao.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
        }

        // Generar JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({ message: 'Login correcto!', token: token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Server error en login.' });
    }
};

export {
    registerUser,
    loginUser
};