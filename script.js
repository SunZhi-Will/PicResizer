document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('upload');
    const dropArea = document.getElementById('drop-area');
    const convertButton = document.getElementById('convert');
    const outputFormatSelect = document.getElementById('output-format');
    const downloadLinksDiv = document.getElementById('download-links');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const previewContainer = document.getElementById('preview-container');

    let files = [];
    let dragCounter = 0;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.addEventListener(eventName, preventDefaults, false);
    });

    // Handle drag enter and leave events to manage the drop area display
    document.addEventListener('dragenter', handleDragEnter, false);
    document.addEventListener('dragleave', handleDragLeave, false);
    document.addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);

    // Handle file conversion
    convertButton.addEventListener('click', convertFiles, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragEnter(e) {
        dragCounter++;
        dropArea.style.display = 'flex';
    }

    function handleDragLeave(e) {
        dragCounter--;
        if (dragCounter === 0) {
            dropArea.style.display = 'none';
        }
    }

    function handleDrop(e) {
        dragCounter = 0;
        dropArea.style.display = 'none';
        files = Array.from(e.dataTransfer.files);
        fileInput.files = e.dataTransfer.files; // synchronize file input with dropped files
        previewFiles(files);
    }

    function handleFiles() {
        files = Array.from(fileInput.files);
        previewFiles(files);
    }

    function previewFiles(files) {
        previewContainer.innerHTML = '';
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = event.target.result;
                    const previewElement = document.createElement('div');
                    previewElement.classList.add('preview');
                    previewElement.appendChild(imgElement);
                    previewContainer.appendChild(previewElement);
                };
                reader.readAsDataURL(file);
            } else {
                alert(`File ${file.name} is not a valid image file.`);
            }
        });
    }

    function convertFiles() {
        if (files.length === 0) {
            alert('Please upload at least one image file.');
            return;
        }

        const outputFormat = outputFormatSelect.value;
        downloadLinksDiv.innerHTML = '';
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';

        let processedFiles = 0;
        progressContainer.style.display = 'block';

        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = 2560;
                        canvas.height = 2560;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, 2560, 2560);
                        canvas.toBlob((blob) => {
                            const url = URL.createObjectURL(blob);
                            const downloadLink = document.createElement('a');
                            downloadLink.href = url;
                            downloadLink.download = `converted_${index + 1}.${outputFormat}`;
                            downloadLink.textContent = `Download ${outputFormat.toUpperCase()} ${index + 1}`;
                            downloadLink.style.display = 'block';
                            downloadLinksDiv.appendChild(downloadLink);

                            processedFiles++;
                            const progress = (processedFiles / files.length) * 100;
                            progressBar.style.width = progress + '%';
                        }, `image/${outputFormat}`);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert(`File ${file.name} is not a valid image file.`);
            }
        });
    }
});
