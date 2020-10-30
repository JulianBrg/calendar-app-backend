const { response } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try {

        //Obtener el id del usuario para crear el evento
        evento.user = req.uid;

        //Guardar en la BD
        const eventoGuardao = await evento.save();

        res.json({
            ok: true,
            evento: eventoGuardao
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador..."
        });
    }
}

const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        //Verficar que si es la persona que creo el evento, si sí, dejarlo pasar al UPDATE
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            eveneto: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }
}

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        //Verficar que si es la persona que creo el evento, si sí, dejarlo pasar al UPDATE
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios de eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);

        res.json({
            ok: true,
            msg: 'Evento eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}