// Add Cart
const cartAdd = (id) => {
    loader(true)
    let formData = {
        'items': [{
            'id': +id,
            'quantity': 1
        }]
    };
    fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            getCart();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Get Drawer Data
const getCartDrawerData = (count) => {
    fetch(window.Shopify.routes.root, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.text();
    })
    .then(data => {
        const parser = new DOMParser();
        const update_document = parser.parseFromString(data, 'text/html');

        // Update Table
        const previous_drawer_table = document.querySelector('.drawer__cart-items-wrapper');
        const update_drawer_table = update_document.querySelector('.drawer__cart-items-wrapper');
        if (previous_drawer_table && update_drawer_table) {
            previous_drawer_table.innerHTML = update_drawer_table.innerHTML;
        }

        // Update Subtotal
        const previous_drawer_footer = document.querySelector('.cart-drawer__footer');
        const update_drawer_footer = update_document.querySelector('.cart-drawer__footer');
        if (previous_drawer_footer && update_drawer_footer) {
            previous_drawer_footer.innerHTML = update_drawer_footer.innerHTML;
        }

        openCart(count);
        loader(false);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Get Cart Data
const getCart = () => {
    fetch(window.Shopify.routes.root + 'cart.js', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const count = data.item_count
            getCartDrawerData(count)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Open & Update Count
const openCart = (count) => {
    document.body.classList.add('overflow-hidden');
    const cart_drawer = document.querySelector('cart-drawer.drawer');
    cart_drawer.classList.add('active');

    const cart_bubble = document.querySelector('.cart-count-bubble');

    if (cart_bubble) {
        cart_bubble.querySelector('span[aria-hidden="true"]').innerHTML = count;
        cart_bubble.querySelector('span.visually-hidden').innerHTML = `${count} item`;
    } else {
        const cart_wrap = document.querySelector('.header__icon--cart');
        const cart_bubble_data = `<div class="cart-count-bubble">
            <span aria-hidden="true">${count}</span>
            <span class="visually-hidden">${count} item</span>
        </div>`;
        cart_wrap.insertAdjacentHTML('beforeend', cart_bubble_data);
    }
}

// Loader
const loader = (state) => {
    const loader_div = document.querySelector('.loader');
    if (loader_div && !state) return loader_div.remove();

    const loader_data = '<div class="loader-wrap"><div class="loader"></div></div>';
    document.body.insertAdjacentHTML('afterbegin', loader_data);
};