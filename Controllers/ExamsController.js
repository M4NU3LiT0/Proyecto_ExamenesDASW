// Controllers/ExamsController.js
const Exam = require("../Models/Exam");

// GET /api/Exams?subject=Mate&page=1&limit=10
exports.getAllExams = async (req, res) => {
  try {
    const { subject, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (subject) filter.subject = subject;

    const skip = (page - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Exam.find(filter).skip(skip).limit(Number(limit)),
      Exam.countDocuments(filter),
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

// GET /api/Exams/:id
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("createdBy", "name email");

    if (!exam) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/Exams
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/Exams/:id
exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!exam)
      return res.status(404).json({ message: "Examen no encontrado" });

    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/Exams/:id
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam)
      return res.status(404).json({ message: "Examen no encontrado" });

    res.status(200).json({ message: "Examen eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
