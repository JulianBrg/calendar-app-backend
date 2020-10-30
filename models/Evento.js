const { Schema, model } = require('mongoose');


const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        //Hacer referencia al usuario que creo el evento
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});

//SIRVE PARA SOBREESCRIBIR EL JSON QUE ENVIA MONGO 
EventoSchema.method('toJSON', function(){
    const { __v, _id, ...object} = this.toObject();
    //REMPLAZO EN EL OBJECT
    object.id = _id;
    return object;
})


module.exports = model('Evento', EventoSchema);