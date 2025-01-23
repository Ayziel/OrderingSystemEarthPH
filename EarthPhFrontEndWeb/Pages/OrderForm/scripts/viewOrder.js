let applybtn = document.querySelector('.apply-label')
const tinUploadInput = document.getElementById('tin-upload');
 const tinFilenameText = document.getElementById('uploaded-tin-filename');

 applybtn.addEventListener('click', () => {
     event.preventDefault(); // Prevent the page from reloading
     alert('Subbmitted')
 })
 tinUploadInput.addEventListener('change', function () {
     const file = tinUploadInput.files[0];
     if (file) {
         // Display the file name in green text
         tinFilenameText.textContent = `Uploaded: ${file.name}`;
         tinFilenameText.style.display = 'block';
     }
 });