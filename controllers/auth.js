const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarToken } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Validacion para verificar el correo
        let usuario = await Usuario.findOne({ email: email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Esperar y grabar en la base de datos
        await usuario.save();

        // Generar el token
        const token = await generarToken(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Buscar el email en la base de datos
        const usuario = await Usuario.findOne({ email: email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Si llega a este punto, generar JWT
        const token = await generarToken(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: 'login',
            uid: usuario.id,
            name: usuario.name,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }


}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    //Generar un nuevo token
    const token = await generarToken(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}