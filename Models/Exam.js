// Models/Exam.js
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "La materia es obligatoria"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha del examen es obligatoria"],
    },
    duration: {
      type: Number, // minutos
      default: 60,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
