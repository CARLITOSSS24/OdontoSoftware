import mongoose from 'mongoose';

const cargoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 40
  }
});

export default mongoose.model('Cargo', cargoSchema); 