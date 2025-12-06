// Models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "El ID del examen es obligatorio"],
    },
    questionText: {
      type: String,
      required: [true, "El texto de la pregunta es obligatorio"],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["multiple-choice", "true-false", "multi-select"],
      required: [true, "El tipo de pregunta es obligatorio"],
    },
    options: [
      {
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    points: {
      type: Number,
      default: 1,
      min: [0, "Los puntos no pueden ser negativos"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

// Validación personalizada: al menos una opción debe ser correcta
questionSchema.pre("save", function (next) {
  if (this.questionType !== "true-false") {
    const hasCorrectAnswer = this.options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      return next(
        new Error("Debe haber al menos una opción correcta en la pregunta")
      );
    }
  }
  next();
});

module.exports = mongoose.model("Question", questionSchema);
