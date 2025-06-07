import mongoose from 'mongoose';

const collection = 'Pets';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {           // ✅ Cambiar de specie → species
    type: String,
    required: true,
  },
  birthDate: Date,
  adopted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Users',
    default: null        // ✅ Esto lo agrega para que no dé error si se envía null
  },
  image: String,
});

const petModel = mongoose.model(collection, schema);
export default petModel;
