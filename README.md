# API Generador de Exámenes - DASW

API REST para un sistema de generación y evaluación de exámenes con autenticación JWT y roles de usuario.

## 📋 Características

- ✅ Autenticación con JWT
- ✅ Sistema de roles (Student/Teacher)
- ✅ CRUD completo de exámenes
- ✅ CRUD completo de preguntas (múltiple opción, multi-selección, verdadero/falso)
- ✅ Sistema de calificación automática
- ✅ Gestión de resultados
- ✅ Paginación y filtros en todas las colecciones
- ✅ Validaciones con Mongoose
- ✅ Códigos de estado HTTP correctos (200, 201, 400, 401, 403, 404, 500)
- ✅ Documentación Swagger/OpenAPI

## 🛠️ Tecnologías

- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- CORS
- dotenv

## 📦 Instalación

### 1. Clonar o descomprimir el proyecto

```bash
cd API-DASW
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.template`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

**Para generar un JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita o inicia sesión
3. Crea un nuevo cluster (Free Tier M0)
4. Configura el acceso a la base de datos:
   - Database Access: Crea un usuario con contraseña
   - Network Access: Agrega tu IP o `0.0.0.0/0` (para permitir acceso desde cualquier IP)
5. Obtén tu connection string:
   - Click en "Connect"
   - Selecciona "Connect your application"
   - Copia el connection string
   - Reemplaza `<password>` con tu contraseña
   - Reemplaza `<database>` con el nombre de tu base de datos (ej: `exam_system`)

### 5. Ejecutar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

## 🔑 Endpoints Principales

### Autenticación (`/api/Auth`)

- `POST /api/Auth/register` - Registrar nuevo usuario
- `POST /api/Auth/login` - Iniciar sesión

### Exámenes (`/api/Exams`)

- `GET /api/Exams` - Listar exámenes (paginado, con filtros)
- `GET /api/Exams/:id` - Obtener examen por ID
- `POST /api/Exams` - Crear examen (requiere teacher)
- `PUT /api/Exams/:id` - Actualizar examen (requiere teacher)
- `DELETE /api/Exams/:id` - Eliminar examen (requiere teacher)

### Preguntas (`/api/Questions`)

- `GET /api/Questions` - Listar preguntas (paginado, con filtros)
- `GET /api/Questions/:id` - Obtener pregunta por ID
- `POST /api/Questions` - Crear pregunta (requiere teacher)
- `PUT /api/Questions/:id` - Actualizar pregunta (requiere teacher)
- `DELETE /api/Questions/:id` - Eliminar pregunta (requiere teacher)

### Resultados (`/api/Results`)

- `POST /api/Results` - Enviar respuestas de examen (requiere student)
- `GET /api/Results/my` - Ver mis resultados (requiere student)
- `GET /api/Results` - Ver todos los resultados (requiere teacher)
- `GET /api/Results/:id` - Ver resultado específico
- `DELETE /api/Results/:id` - Eliminar resultado (requiere teacher)

## 🔐 Autenticación

Los endpoints protegidos requieren un token JWT en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo con curl:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/Exams
```

## 👥 Roles

### Student (Estudiante)
- Puede ver exámenes y preguntas
- Puede responder exámenes
- Puede ver sus propios resultados

### Teacher (Profesor)
- Puede crear/modificar/eliminar exámenes
- Puede crear/modificar/eliminar preguntas
- Puede ver todos los resultados

## 📝 Ejemplos de Uso

### 1. Registrar un profesor

```bash
POST /api/Auth/register
Content-Type: application/json

{
  "name": "Profesor Juan",
  "email": "profesor@example.com",
  "password": "password123",
  "role": "teacher"
}
```

### 2. Iniciar sesión

```bash
POST /api/Auth/login
Content-Type: application/json

{
  "email": "profesor@example.com",
  "password": "password123"
}

# Respuesta:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Profesor Juan",
    "role": "teacher"
  }
}
```

### 3. Crear un examen (Teacher)

```bash
POST /api/Exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Examen de Matemáticas - Álgebra",
  "subject": "Matemáticas",
  "date": "2024-12-15T10:00:00Z",
  "duration": 90
}
```

### 4. Crear una pregunta (Teacher)

```bash
POST /api/Questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "examId": "507f1f77bcf86cd799439011",
  "questionText": "¿Cuál es el resultado de 2 + 2?",
  "questionType": "multiple-choice",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true },
    { "text": "5", "isCorrect": false }
  ],
  "points": 1,
  "difficulty": "easy"
}
```

### 5. Enviar respuestas (Student)

```bash
POST /api/Results
Authorization: Bearer <token_estudiante>
Content-Type: application/json

{
  "examId": "507f1f77bcf86cd799439011",
  "answers": [
    {
      "questionId": "507f1f77bcf86cd799439012",
      "selectedOptions": [1]
    }
  ]
}

# Respuesta incluye calificación automática:
{
  "_id": "507f1f77bcf86cd799439013",
  "examId": "507f1f77bcf86cd799439011",
  "studentId": "507f1f77bcf86cd799439014",
  "totalScore": 8,
  "maxScore": 10,
  "percentage": 80,
  "passed": true,
  "answers": [...]
}
```

## 📚 Documentación

- **Postman Collection:** `Postman_Collection.json`
- **Swagger/OpenAPI:** `swagger.yaml`

### Usar con Postman

1. Importa `Postman_Collection.json` en Postman
2. Configura la variable `baseUrl` a `http://localhost:3000`
3. Ejecuta los requests en orden (Register → Login → Create Exam → etc.)

### Usar con Swagger UI

Puedes visualizar la documentación usando [Swagger Editor](https://editor.swagger.io/):

1. Copia el contenido de `swagger.yaml`
2. Pégalo en Swagger Editor
3. Explora la documentación interactiva

## 🗂️ Estructura del Proyecto

```
API-DASW/
├── Controllers/
│   ├── AuthController.js
│   ├── ExamsController.js
│   ├── QuestionsController.js
│   └── ResultsController.js
├── Models/
│   ├── User.js
│   ├── Exam.js
│   ├── Question.js
│   └── Result.js
├── Routes/
│   ├── Auth.js
│   ├── Exams.js
│   ├── Questions.js
│   └── Results.js
├── middlewares/
│   └── Auth.js
├── Server.js
├── Package.json
├── .env.template
├── Postman_Collection.json
├── swagger.yaml
└── README.md
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGODB_URI` | Connection string de MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Clave secreta para JWT | Genera con crypto |

## 🧪 Testing con Postman

La colección de Postman incluye:

- ✅ Tests automáticos de códigos de estado
- ✅ Variables de colección para IDs
- ✅ Ejemplos para cada endpoint
- ✅ Flujo completo de uso

**Orden sugerido:**
1. Auth → Register Teacher
2. Auth → Login Teacher (guarda token)
3. Exams → Create Exam (guarda examId)
4. Questions → Create Question (guarda questionId)
5. Auth → Register Student
6. Auth → Login Student (guarda token)
7. Results → Submit Exam
8. Results → Get My Results

## 🚨 Códigos de Estado HTTP

- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Error de validación)
- `401` - Unauthorized (Token inválido o no proporcionado)
- `403` - Forbidden (Sin permisos para la operación)
- `404` - Not Found (Recurso no encontrado)
- `500` - Internal Server Error (Error del servidor)

## 📌 Notas Importantes

1. **Seguridad:** Nunca subas tu archivo `.env` al repositorio
2. **JWT:** Los tokens expiran en 1 hora
3. **Resultados:** Un estudiante solo puede enviar un examen una vez
4. **Calificación:** Se calcula automáticamente al enviar respuestas
5. **Aprobación:** Se requiere 60% o más para aprobar

## 🎓 Autor

Proyecto desarrollado para la materia de Desarrollo de Aplicaciones y Servicios Web (DASW)

## 📄 Licencia

ISC
