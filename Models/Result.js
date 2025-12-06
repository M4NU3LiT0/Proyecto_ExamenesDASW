// Models/Result.js
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "El ID del examen es obligatorio"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID del estudiante es obligatorio"],
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOptions: [
          {
            type: Number, // Índice de las opciones seleccionadas
          },
        ],
        isCorrect: {
          type: Boolean,
          default: false,
        },
        pointsEarned: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalScore: {
      type: Number,
      required: true,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Índice compuesto para evitar duplicados (un estudiante solo puede tener un resultado por examen)
resultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

// Calcular porcentaje antes de guardar
resultSchema.pre("save", function (next) {
  if (this.maxScore > 0) {
    this.percentage = (this.totalScore / this.maxScore) * 100;
    this.passed = this.percentage >= 60; // 60% para aprobar
  }
  next();
});

module.exports = mongoose.model("Result", resultSchema);
