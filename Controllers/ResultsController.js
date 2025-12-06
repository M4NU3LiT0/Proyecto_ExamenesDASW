// Controllers/ResultsController.js
const Result = require("../Models/Result");
const Question = require("../Models/Question");
const Exam = require("../Models/Exam");

// POST /api/Results - Enviar respuestas de un examen
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user.id;

    // Verificar que el examen existe
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    // Verificar que el estudiante no haya enviado ya este examen
    const existingResult = await Result.findOne({ examId, studentId });
    if (existingResult) {
      return res.status(400).json({ message: "Ya has enviado este examen" });
    }

    // Obtener todas las preguntas del examen
    const questions = await Question.find({ examId });

    if (questions.length === 0) {
      return res.status(400).json({ message: "El examen no tiene preguntas" });
    }

    let totalScore = 0;
    let maxScore = 0;
    const gradedAnswers = [];

    // Calificar cada respuesta
    for (const answer of answers) {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        continue; // Saltar si la pregunta no existe
      }

      maxScore += question.points;

      let isCorrect = false;
      let pointsEarned = 0;

      // Verificar respuesta según el tipo de pregunta
      if (question.questionType === "multiple-choice" || question.questionType === "true-false") {
        // Para multiple-choice y true-false, solo una opción debe estar seleccionada
        const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
        
        if (answer.selectedOptions.length === 1 && answer.selectedOptions[0] === correctOptionIndex) {
          isCorrect = true;
          pointsEarned = question.points;
        }
      } else if (question.questionType === "multi-select") {
        // Para multi-select, todas las opciones correctas deben estar seleccionadas
        const correctIndices = question.options
          .map((opt, idx) => (opt.isCorrect ? idx : -1))
          .filter((idx) => idx !== -1);

        const selectedSorted = [...answer.selectedOptions].sort();
        const correctSorted = [...correctIndices].sort();

        if (JSON.stringify(selectedSorted) === JSON.stringify(correctSorted)) {
          isCorrect = true;
          pointsEarned = question.points;
        }
      }

      if (isCorrect) {
        totalScore += pointsEarned;
      }

      gradedAnswers.push({
        questionId: answer.questionId,
        selectedOptions: answer.selectedOptions,
        isCorrect,
        pointsEarned,
      });
    }

    // Crear el resultado
    const result = await Result.create({
      examId,
      studentId,
      answers: gradedAnswers,
      totalScore,
      maxScore,
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ya has enviado este examen" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/Results - Obtener todos los resultados (solo para teachers)
exports.getAllResults = async (req, res) => {
  try {
    const { examId, studentId, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (examId) filter.examId = examId;
    if (studentId) filter.studentId = studentId;

    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Result.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("examId", "title subject")
        .populate("studentId", "name email"),
      Result.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/Results/my - Obtener los resultados del estudiante actual
exports.getMyResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { examId, page = 1, limit = 10 } = req.query;

    const filter = { studentId };
    if (examId) filter.examId = examId;

    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Result.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("examId", "title subject date"),
      Result.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/Results/:id - Obtener un resultado específico
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("examId", "title subject date")
      .populate("studentId", "name email")
      .populate("answers.questionId");

    if (!result) {
      return res.status(404).json({ message: "Resultado no encontrado" });
    }

    // Si es estudiante, solo puede ver sus propios resultados
    if (req.user.role === "student" && result.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para ver este resultado" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/Results/:id - Eliminar un resultado (solo teachers)
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Resultado no encontrado" });
    }

    res.status(200).json({ message: "Resultado eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
