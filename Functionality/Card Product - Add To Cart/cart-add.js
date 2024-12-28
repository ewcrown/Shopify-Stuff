// Add to Cart
const cartAdd = async (id) => {
  try {
    loader(true);

    const formData = {
      items: [
        {
          id: +id,
          quantity: 1,
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, options);
    if (!response.ok) throw new Error('Failed to add item to the cart.');

    const cart = await getCart();
    const itemCount = cart?.item_count || 0;

    const drawerUpdated = await getCartDrawerData();
    if (drawerUpdated) {
      openCart(itemCount);
      updateCartBubble(itemCount);
    }
    console.log('Cart updated successfully');
  } catch (error) {
    console.error('Error in cartAdd:', error);
  } finally {
    loader(false);
  }
};

// Get Drawer Data
const getCartDrawerData = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${window.Shopify.routes.root}`, options);
    if (!response.ok) throw new Error('Failed to fetch drawer data.');

    const data = await response.text();
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(data, 'text/html');

    document.querySelector('#CartDrawer cart-drawer-items')?.classList?.remove('is-empty')
    document.querySelector('cart-drawer.drawer')?.classList?.remove('is-empty')
    document.querySelector('.drawer__inner-empty')?.remove()
    document.querySelector('#CartDrawer-Checkout')?.removeAttribute('disabled')

    // Update cart items and footer
    updateInnerHTML('#CartDrawer #CartDrawer-Form', parsedDocument);
    updateInnerHTML('.cart-drawer__footer', parsedDocument);

    return true;
  } catch (error) {
    console.error('Error in getCartDrawerData:', error);
    return false;
  }
};

// Update InnerHTML Helper
const updateInnerHTML = (selector, newDocument) => {
  const currentElement = document.querySelector(selector);
  const updatedElement = newDocument.querySelector(selector);
  if (currentElement && updatedElement) {
    currentElement.innerHTML = updatedElement.innerHTML;
  }
};

// Get Cart Data
const getCart = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${window.Shopify.routes.root}cart.js`, options);
    if (!response.ok) throw new Error('Failed to fetch cart data.');
    return await response.json();
  } catch (error) {
    console.error('Error in getCart:', error);
    return null;
  }
};

// Open Cart Drawer and Update Item Count
const openCart = (itemCount) => {
  document.body.classList.add('overflow-hidden');
  const cartDrawer = document.querySelector('cart-drawer.drawer');
  if (cartDrawer) cartDrawer.classList.add('active');
};

// Update Cart Bubble Helper
const updateCartBubble = (itemCount) => {
  const cartBubble = document.querySelector('.cart-count-bubble');
  if (cartBubble) {
    cartBubble.querySelector('span[aria-hidden="true"]').textContent = itemCount;
    cartBubble.querySelector('span.visually-hidden').textContent = `${itemCount} item${itemCount > 1 ? 's' : ''}`;
  } else {
    const cartIcon = document.querySelector('.header__icon--cart');
    if (cartIcon) {
      const bubbleHTML = `
        <div class="cart-count-bubble">
          <span aria-hidden="true">${itemCount}</span>
          <span class="visually-hidden">${itemCount} item${itemCount > 1 ? 's' : ''}</span>
        </div>`;
      cartIcon.insertAdjacentHTML('beforeend', bubbleHTML);
    }
  }
};

// Loader
const loader = (state) => {
  const existingLoader = document.querySelector('.loader-wrap');
  if (existingLoader && !state) {
    existingLoader.remove();
  } else if (state) {
    const loaderHTML = `
      <div class="loader-wrap">
        <div class="loader"></div>
      </div>`;
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
  }
};
