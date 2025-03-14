document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("[data-cart-input]");
  const variantSelect = document.querySelector("#ew-variant-ids");
  const submitButton = document.querySelector("[data-product-add-to-cart]");

  // Function to check variant availability
  function checkVariantAvailability() {
    const selectedValues = [...document.querySelectorAll("[data-cart-input]:checked")].map(input => input.value);
    let matchedOption = null;

    // Loop through select options and find a match
    Array.from(variantSelect.options).forEach((option) => {
      const optionValues = Object.values(option.dataset).map(val => val.trim()).filter(Boolean);
      const isMatch = selectedValues.every(val => optionValues.includes(val));

      if (isMatch) {
        matchedOption = option;
        option.selected = true;
        console.log(`Matched Option: ${option.value}`);
      } else {
        option.selected = false;
      }
    });

    // Handle out-of-stock scenario
    if (matchedOption) {
      console.log("Final Selected Variant:", matchedOption.value);
      submitButton.dataset.id = matchedOption.dataset.id;

      if (matchedOption.disabled) {
        submitButton.disabled = true;
        submitButton.textContent = "Out of Stock";
      } else {
        submitButton.disabled = false;
        submitButton.textContent = "Add to Cart";
      }
    } else {
      console.log("No matching variant found!");
      submitButton.disabled = true;
      submitButton.textContent = "Select a Variant";
    }
  }

  // Attach event listeners to inputs
  if (inputs.length > 0) {
    inputs.forEach((input) => {
      input.addEventListener("change", checkVariantAvailability);
    });
  }

  // Run the function on page load
  checkVariantAvailability();
});


const submitButton = document.querySelector('[data-product-add-to-cart]')

if (submitButton) {
  submitButton.addEventListener('click', async (e) => {
    const variant_id = submitButton.dataset.id
    const quantity = document.querySelector('.quantity-value')
    e.target.innerHTML = "Adding...";
    await cartAdd(variant_id, quantity.innerText);
    e.target.innerHTML = "Added";
    setTimeout(() => {
      e.target.innerHTML = "Add To Cart";
    }, 2000)
  })
}

// Quantity Selector
const quantitySelector = document.querySelector('.quantity-selector')
const minusBtn = document.querySelector('.minus');
const plusBtn = document.querySelector('.plus');
const quantityValue = document.querySelector('.quantity-value');
if (quantitySelector) {
  let quantity = parseInt(quantityValue.textContent);
  minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
    }
    minusBtn.disabled = quantity <= 1;
  });
  plusBtn.addEventListener('click', () => {
    quantity++;
    quantityValue.textContent = quantity;
    minusBtn.disabled = false;
  });
  minusBtn.disabled = quantity <= 1;
}


