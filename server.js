const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configuración de Multer para la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

// Validaciones para Multer
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB (tamaño máximo del archivo)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no admitido'));
        }
    }
});

// Middleware para verificar tamaño máximo de archivo
function checkFileSize(req, res, next) {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (req.files.some(file => file.size > maxSize)) {
        return res.status(400).send('Uno o más archivos superan el tamaño máximo permitido (5 MB)');
    }
    next();
}

// Middleware para verificar si se han seleccionado archivos
function checkFilesSelected(req, res, next) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('Seleccione al menos un archivo');
    }
    next();
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para subir archivos con validación de tamaño y archivos seleccionados
app.post('/upload', upload.array('files', 5), checkFileSize, checkFilesSelected, (req, res) => {
    const fileInfos = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
    }));

    res.send(fileInfos);
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
