// Routes/Questions.js
const express = require("express");
const router = express.Router();
const questionController = require("../Controllers/QuestionsController");
const authMiddleware = require("../middlewares/Auth");

// Rutas públicas (listar preguntas, con filtros/paginación)
router.get("/", questionController.getAllQuestions);

// Obtener una pregunta específica por ID
router.get("/:id", questionController.getQuestionById);

// Rutas protegidas (solo teachers pueden crear/modificar/eliminar preguntas)
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  questionController.createQuestion
);

router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  questionController.updateQuestion
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  questionController.deleteQuestion
);

module.exports = router;
