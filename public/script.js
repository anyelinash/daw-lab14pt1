const form = document.querySelector('#uploadForm');
const fileInfoDiv = document.querySelector('#file-info');
const addFileBtn = document.querySelector('#addFile');
const submitBtn = document.querySelector('#submitBtn');
const fileInputsContainer = document.querySelector('#fileInputsContainer');

// Agregar campo de archivo
addFileBtn.addEventListener('click', () => {
    const fileInput = document.createElement('div');
    fileInput.classList.add('file-input');
    fileInput.innerHTML = `
        <input type="file" name="files" multiple>
        <button type="button" class="remove-file">-</button>
    `;
    fileInputsContainer.appendChild(fileInput);

    // Manejar eliminación del campo de archivo
    const removeFileBtn = fileInput.querySelector('.remove-file');
    removeFileBtn.addEventListener('click', () => {
        fileInputsContainer.removeChild(fileInput);
    });
});

// Manejar envío del formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            displayErrorMessage(errorMessage);
            return;
        }

        const fileInfos = await response.json();
        displayFileInfos(fileInfos);
    } catch (error) {
        displayErrorMessage(error.message);
    }
});

// Función para mostrar información de archivos
function displayFileInfos(fileInfos) {
    fileInfoDiv.innerHTML = '';
    fileInfos.forEach(fileInfo => {
        const fileDiv = document.createElement('div');
        fileDiv.classList.add('file-item');
        fileDiv.innerHTML = `
            <p><strong>Nombre: </strong>${fileInfo.originalname}</p>
            <p><strong>Tamaño: </strong>${formatBytes(fileInfo.size)}</p>
            <p><strong>Tipo MIME: </strong>${fileInfo.mimetype}</p>
        `;
        fileInfoDiv.appendChild(fileDiv);
    });
}

// Función para mostrar mensaje de error
function displayErrorMessage(message) {
    fileInfoDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

// Función para formatear bytes
function formatBytes(bytes) {
    const kb = bytes / 1024;
    return kb < 1024 ? kb.toFixed(2) + ' KB' : (kb / 1024).toFixed(2) + ' MB';
}
