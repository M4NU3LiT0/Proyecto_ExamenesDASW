// Controllers/QuestionsController.js
const Question = require("../Models/Question");
const Exam = require("../Models/Exam");

// GET /api/Questions?examId=xxxxx&page=1&limit=10
exports.getAllQuestions = async (req, res) => {
  try {
    const { examId, difficulty, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (examId) filter.examId = examId;
    if (difficulty) filter.difficulty = difficulty;

    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Question.find(filter).skip(skip).limit(Number(limit)).populate("examId", "title subject"),
      Question.countDocuments(filter),
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

// GET /api/Questions/:id
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("examId", "title subject");

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/Questions
exports.createQuestion = async (req, res) => {
  try {
    // Verificar que el examen existe
    const exam = await Exam.findById(req.body.examId);
    if (!exam) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    // Verificar que el usuario que crea la pregunta es el creador del examen
    if (exam.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para agregar preguntas a este examen" });
    }

    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/Questions/:id
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("examId");

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    // Verificar que el usuario que actualiza la pregunta es el creador del examen
    if (question.examId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta pregunta" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedQuestion);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/Questions/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate("examId");

    if (!question) {
      return res.status(404).json({ message: "Pregunta no encontrada" });
    }

    // Verificar que el usuario que elimina la pregunta es el creador del examen
    if (question.examId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta pregunta" });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Pregunta eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
