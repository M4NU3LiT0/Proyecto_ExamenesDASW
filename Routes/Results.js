// Routes/Results.js
const express = require("express");
const router = express.Router();
const resultController = require("../Controllers/ResultsController");
const authMiddleware = require("../middlewares/Auth");

// Ruta para que estudiantes envíen sus respuestas
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isStudent,
  resultController.submitExam
);

// Ruta para que estudiantes vean sus propios resultados
router.get(
  "/my",
  authMiddleware.verifyToken,
  authMiddleware.isStudent,
  resultController.getMyResults
);

// Rutas para teachers (ver todos los resultados)
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  resultController.getAllResults
);

// Obtener un resultado específico (students solo ven los suyos, teachers ven todos)
router.get(
  "/:id",
  authMiddleware.verifyToken,
  resultController.getResultById
);

// Eliminar un resultado (solo teachers)
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isTeacher,
  resultController.deleteResult
);

module.exports = router;
