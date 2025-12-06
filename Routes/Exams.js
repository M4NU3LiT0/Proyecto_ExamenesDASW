// Routes/Exams.js
const express = require("express");
const router = express.Router();
const examController = require("../Controllers/ExamsController");
const authMiddleware = require("../middlewares/Auth");

// Rutas públicas (listar exámenes, con filtros/paginación)
router.get("/", examController.getAllExams);

// Obtener un examen específico por ID (público para que estudiantes puedan verlo)
router.get("/:id", examController.getExamById);

// Rutas protegidas (solo usuarios con token y teacher)
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  examController.createExam
);

router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  examController.updateExam
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  examController.deleteExam
);

module.exports = router;
