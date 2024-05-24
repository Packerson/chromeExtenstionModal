
function showModalOnClick() {
  fetch(chrome.runtime.getURL('src/res/modal.html'))
    .then(response => response.text())
    .then(data => {
      const modal = document.createElement('div');
      modal.id = 'extension-modal';

      modal.style.position = 'fixed';
      modal.style.top = '20%';
      modal.style.left = '40%';
      modal.style.bottom = '50%';
      modal.style.right = '50%';

      modal.style.width = '602px';
      modal.style.maxWidth = '602px';
      modal.style.height = '650px';
      modal.style.maxHeight = '650px';

      modal.style.border = '1px solid #000';
      modal.style.backgroundColor = '#fff';
      modal.style.zIndex = '10000';

      modal.style.display = 'flex';
      modal.style.flexDirection = 'row';
      modal.style.flexWrap = 'wrap';

      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.borderRadius = '8px';

      modal.style.margin = 0;
      modal.style.padding = '0, 0 20px';

      const shadow = modal.attachShadow({ mode: 'open' });
      shadow.innerHTML = data;

      // Apply styles directly in the shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          margin-top: 10px;
          flex-grow: 1;
          display: flex;
          overflow: scroll-y;
          flex-wrap: wrap;
          flex-direction: row;
          width: 100%;
          height: 58%;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .image-list {
          width: 100%;
          height: 95%;
          flex-direction: row;
          flex-wrap: wrap;
          overflow-y: auto;
          display: flex;
          padding: 5px;
          margin: 5px;
          gap: 5px;
          align-items: start;
        }
        .image-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .image-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }

        .modal-footer {
          display: flex;
          flex-direction: column;
          padding: 5px;
          width: 100%;
          border-top: 1px solid #ddd;
        }
        .modal-footer label {
          margin: 5px 0;
        }
        .modal-footer input,
        .modal-footer textarea {
          width: calc(100% - 10px);
          margin: 5px 0;
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-footer button {
          margin-top: 10px;
          padding: 10px;
          background-color: #ffff;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          text-color: black;
        }
      `;
      shadow.appendChild(style);

      document.body.appendChild(modal);

      shadow.getElementById('closeButton').addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      const imageList = shadow.getElementById('imageList');
      const images = document.querySelectorAll('img');

      images.forEach(img => {
        const imgClone = img.cloneNode();
        imgClone.style.width = '80px';
        imgClone.style.height = '80px';
        imgClone.style.margin = '10px';

        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = img.src;

        imageItem.appendChild(imgClone);
        imageItem.appendChild(checkbox);
        imageList.appendChild(imageItem);
      });

      const uploadButton = shadow.getElementById('uploadButton');
      uploadButton.addEventListener('click', () => {
        const selectedImages = [];
        const checkboxes = shadow.querySelectorAll('.image-item input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
          selectedImages.push(checkbox.value);
        });

        // Prześlij wybrane obrazki na backend
        fetch('https://your-backend-endpoint.com/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ images: selectedImages })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            alert('Images uploaded successfully!');
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Failed to upload images.');
          });
      });
    });
}

// To ensure the function is available when the content script is injected
if (typeof showModalOnClick === 'function') {
  showModalOnClick();
}
