
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

      modal.style.width = '650px';
      modal.style.maxWidth = '650px';
      modal.style.height = '650px';
      modal.style.maxHeight = '650px';

      modal.style.border = '1px solid #000';
      modal.style.backgroundColor = '#e5e5e5';
      modal.style.zIndex = '10000';

      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.flexWrap = 'wrap';

      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';

      modal.style.margin = 0;

      const shadow = modal.attachShadow({ mode: 'open' });
      shadow.innerHTML = data;

      // Apply styles directly in the shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        .modal-container {
          width: 650px;
          height: 650px;
          background-color: gray;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          margin-top: 10px;
          overflow-y: auto;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .image-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 10px;
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
      `;
      shadow.appendChild(style);

      document.body.appendChild(modal);

      shadow.getElementById('closeButton').addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      const imageList = shadow.getElementById('imageList');

      imageList.style.width = '100%';
      imageList.style.height = '100%';
      imageList.style.display = 'flex';
      imageList.style.flexDirection = 'row';
      imageList.style.flexWrap = 'wrap';
      imageList.style.justifyContent = 'center';
      imageList.style.alignItems = 'center';
      imageList.style.overflow = 'auto';
      imageList.style.padding = '0';
      imageList.style.margin = '5px';

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
