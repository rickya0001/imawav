document.getElementById('file-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const inputFile = document.getElementById('input-file').files[0];
    const outputFileName = document.getElementById('output-file').value;
    const messageElement = document.getElementById('message');

    if (!inputFile || !outputFileName) {
        messageElement.textContent = 'Please select an input file and specify an output file name.';
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const byteContent = new Uint8Array(event.target.result);
            const cleanedByteContent = removeBytesUpToRiff(byteContent);
            saveFile(cleanedByteContent, outputFileName);
            messageElement.textContent = `File converted and saved as ${outputFileName}.`;
        } catch (e) {
            messageElement.textContent = `Error converting file: ${e.message}`;
        }
    };

    reader.onerror = function() {
        messageElement.textContent = 'Error reading input file.';
    };

    reader.readAsArrayBuffer(inputFile);
});

function removeBytesUpToRiff(buffer) {
    // Convert Uint8Array to string for indexOf search
    const bufferStr = String.fromCharCode.apply(null, buffer);
    const riffIndex = bufferStr.indexOf('RIFF');
    
    if (riffIndex === -1) {
        throw new Error("The 'RIFF' marker was not found in the byte content.");
    }
    
    // Return the content starting from the "RIFF" marker
    return buffer.slice(riffIndex);
}

function saveFile(byteContent, fileName) {
    const blob = new Blob([byteContent], { type: 'audio/wav' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
