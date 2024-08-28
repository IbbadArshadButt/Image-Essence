const imageUpload = document.getElementById('imageUpload'); 
const canvas = document.getElementById('imageCanvas'); 
const ctx = canvas.getContext('2d'); 

let originalImage = null;  // Store the original image data
let blurValue = 0;  // Store the initial blur value to zero
let sharpenValue = 1;  // Store the initial sharp value to one

// Maximum dimensions for the canvas
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

imageUpload.addEventListener('change', function() {
    const file = imageUpload.files[0];  //Get the first file the user selected (assuming user select just one file).
    const reader = new FileReader();  //Object to read the image data from the file.

    //This function runs when the file is successfully read.
    reader.onload = function(e) {
        const img = new Image();  //Create a new image object. Its just as creating a blank picture frame where we will place the uploaded image.
      
        //Runs when the image data is loaded into the "img" object
        img.onload = function() { 
            // Calculate new dimensions while maintaining the aspect ratio
            // These store the original width and height of the uploaded image.
            let width = img.width;
            let height = img.height;

            // Imagine shrinking a large painting to fit in a smaller frame. Reduce both the height and width proportionally, so the painting doesn't get distorted.
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }

            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }

            // Canvas size adjustment to match the resized dimensions of the image.
            canvas.width = width;
            canvas.height = height;

            // Draw the image to fit within the canvas
            ctx.drawImage(img, 0, 0, width, height);
            originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);  // Store the original image data
        }
        img.src = e.target.result; //set the source of an image element to the data that was read from a file. 
    }

    reader.readAsDataURL(file);  //Reads the file and starts converting it to a Data URL.
});

// Function to show a notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 500); // Ensure it stays hidden after fade-out
    }, 2000); // Notification duration (2 seconds)
}

// Modify applyBlur function
function applyBlur() {
    if (!originalImage) {
        showNotification("Please upload an image first!");
        return;
    }
    blurValue += 4; 
    ctx.filter = `blur(${blurValue}px)`;  
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none'; 
    document.getElementById('blurValue').textContent = blurValue;
}

// Modify applySharpen function
function applySharpen() {
    if (!originalImage) {
        showNotification("Please upload an image first!");
        return;
    }
    sharpenValue += 0.5;  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);  
    const data = imageData.data;  
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * sharpenValue;     
        data[i + 1] = data[i + 1] * sharpenValue; 
        data[i + 2] = data[i + 2] * sharpenValue; 
    }

    ctx.putImageData(imageData, 0, 0);  
    document.getElementById('sharpenValue').textContent = sharpenValue.toFixed(1);  
}

// Modify applyWatermark function in a similar way if needed.
function applyWatermark() {
    if (!originalImage) {
        showNotification("Please upload an image first!");
        return;
    }
    const text = document.getElementById('watermarkText').value;
    ctx.font = '48px serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText(text, canvas.width - 20, canvas.height - 20);  
}

function downloadImage() {
    const link = document.createElement('a');  // An anchor tag is created
    link.download = 'processed_image.png';  // Default filename for the image when the user downloads it.
    link.href = canvas.toDataURL();  //Setting the href attribute of the link to the data URL of the image on the canvas. 
    link.click();  // Simulates a click on the link element to trigger the download process.
}
