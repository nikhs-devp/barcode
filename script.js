document.addEventListener('DOMContentLoaded', () => {
  const colorOptions = document.querySelectorAll('.color-option');
  const selectedColorsContainer = document.getElementById('selectedColors');
  const productForm = document.getElementById('productForm');
  const barcodeResults = document.getElementById('barcodeResults');
  const sizeCheckboxes = document.querySelectorAll('.size-checkbox');

  const selectedColors = new Set();
  const selectedSizes = new Set();

  // Color Selection Logic
  colorOptions.forEach(option => {
      option.addEventListener('click', () => {
          const color = option.getAttribute('data-color');
          const colorName = option.getAttribute('data-name');

          if (selectedColors.has(color)) {
              selectedColors.delete(color);
              option.classList.remove('selected');
          } else {
              selectedColors.add(color);
              option.classList.add('selected');
          }
          updateSelectedColorDisplay();
      });
  });

  function updateSelectedColorDisplay() {
      selectedColorsContainer.innerHTML = '';
      selectedColors.forEach(color => {
          const colorOption = document.querySelector(`.color-option[data-color="${color}"]`);
          const colorName = colorOption.getAttribute('data-name');
          
          const colorTag = document.createElement('div');
          colorTag.className = 'selected-color-tag';
          colorTag.innerHTML = `
              <div class="color-preview" style="background-color: ${color};"></div>
              ${colorName}
              <span class="remove-color" onclick="removeColor('${color}')">×</span>
          `;
          selectedColorsContainer.appendChild(colorTag);
      });
  }

  // Size Selection Logic
  sizeCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
              selectedSizes.add(checkbox.value);
          } else {
              selectedSizes.delete(checkbox.value);
          }
      });
  });

  // Remove Color Function
  window.removeColor = function(color) {
      selectedColors.delete(color);
      document.querySelector(`.color-option[data-color="${color}"]`).classList.remove('selected');
      updateSelectedColorDisplay();
  };

  // Generate Unique Barcode Number
  function generateUniqueBarcode() {
      return Math.floor(100000000 + Math.random() * 900000000).toString();
  }

  // Form Submission
  productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Form Validation
      if (!productForm.checkValidity()) {
          productForm.classList.add('was-validated');
          return;
      }
      
      const projectName = document.getElementById('projectName').value;
      const basePrice = parseFloat(document.getElementById('basePrice').value) || 0;

      barcodeResults.innerHTML = '';

      // Validation Checks
      if (selectedColors.size === 0) {
          alert('Please select at least one color');
          return;
      }

      if (selectedSizes.size === 0) {
          alert('Please select at least one size');
          return;
      }

      // Generate Variants
      let variantCounter = 1;
      selectedSizes.forEach(size => {
          selectedColors.forEach((color, colorIndex) => {
              const colorOption = document.querySelector(`.color-option[data-color="${color}"]`);
              const colorName = colorOption.getAttribute('data-name');
              
              // Precise Price Calculation
              const variantPrice = basePrice ;
              
              // Generate Unique Barcode Number
              const uniqueBarcodeNumber = generateUniqueBarcode();
              
              const variantName = `${projectName}-${size}-${colorName}`;
              
              const barcodeVariant = document.createElement('div');
              barcodeVariant.className = 'col-md-4';
              barcodeVariant.innerHTML = `
                  <div class="card h-100">
                      <div class="card-body text-center">
                          <h5 class="card-title">${variantName}</h5>
                          <p class="card-text">Price: $${variantPrice}</p>
                          <p class="text-muted small">Barcode: ${uniqueBarcodeNumber}</p>
                          <canvas id="barcode-${variantCounter}"></canvas>
                      </div>
                  </div>
              `;
              
              barcodeResults.appendChild(barcodeVariant);

              // Generate Barcode
              const barcodeCanvas = barcodeVariant.querySelector('canvas');
              JsBarcode(barcodeCanvas, uniqueBarcodeNumber, {
                  format: "CODE128",
                  width: 2,
                  height: 100,
                  displayValue: true
              });

              variantCounter++;
          });
      });
  });

  // Bootstrap form validation
  (function() {
      'use strict';
      window.addEventListener('load', function() {
          var forms = document.getElementsByClassName('needs-validation');
          var validation = Array.prototype.filter.call(forms, function(form) {
              form.addEventListener('submit', function(event) {
                  if (form.checkValidity() === false) {
                      event.preventDefault();
                      event.stopPropagation();
                  }
                  form.classList.add('was-validated');
              }, false);
          });
      }, false);
  })();
});