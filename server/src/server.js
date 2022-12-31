import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration & Constants
const PORT = 3000
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Library API",
            version: '1.0.0',
        },
    },
    apis: ["src/server.js"],
};

const app = express()
const swaggerDocs = swaggerJsDoc(swaggerOptions);
let books = [];

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * @swagger
 * /books:
 *   get:
 *     description: Get all books
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.get('/books', (req, res) => {
    res.json(books);
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}! \n-------------`))