const LOCAL_STORAGE_WISHLIST_KEY = 'shopify-wishlist';
const LOCAL_STORAGE_DELIMITER = ',';
const BUTTON_ACTIVE_CLASS = 'active';
const GRID_LOADED_CLASS = 'loaded';

const selectors = {
    button: '[button-wishlist]',
    grid: '[grid-wishlist]',
    productCard: '.product-card',
};

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
    initGrid();
});

document.addEventListener('shopify-wishlist:updated', (event) => {
    console.log('[Shopify Wishlist] Wishlist Updated ✅', event.detail.wishlist);
    let text = "Your wishlist updated. Click OK to view wishlist";
    if (confirm(text) == true) {
        window.open('/pages/wishlist')
    }
    initGrid();
});

document.addEventListener('shopify-wishlist:init-product-grid', (event) => {
    console.log('[Shopify Wishlist] Wishlist Product List Loaded ✅', event.detail.wishlist);
});

document.addEventListener('shopify-wishlist:init-buttons', (event) => {
    console.log('[Shopify Wishlist] Wishlist Buttons Loaded ✅', event.detail.wishlist);
});

const fetchProductCardHTML = (handle) => {
    const productTileTemplateUrl = `/products/${handle}?view=card`;
    return fetch(productTileTemplateUrl)
        .then((res) => res.text())
        .then((res) => {
            // console.log(res);
            const text = res;
            const parser = new DOMParser();
            // console.log(parser);
            const htmlDocument = parser.parseFromString(text, 'text/html');

            const productInfo = htmlDocument.documentElement.querySelector('.product');
            const title = productInfo.querySelector(".product__title h1").innerHTML
            const image = productInfo.querySelector(".product__media img").src
            const price = productInfo.querySelector(".price").innerHTML

            const product_data = `
    <li class="grid__item scroll-trigger animate--slide-in" data-cascade>
        <div class="luis-product-card">
            <div class="luis-product-featured-image-wrap">
                <a href="/products/${handle}">
                    <img src="${image}" class="img-responsive" />
                </a>
            </div>
            <div class="luis-product-details">
                <a href="/products/${handle}">
                    <div class="luis-product-left-block">
                        <h3>${title}</h3>
                    </div>
                    <div class="luis-product-right-block">
                        <div class="price">
                            ${price}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </li>
    `

            console.log("productCard", product_data)
            return product_data;
        })
        .catch((err) => console.error(`[Shopify Wishlist] Failed to load content for handle: ${handle}`, err));
};

const setupGrid = async (grid) => {
    const wishlist = getWishlist();
    const requests = wishlist.map(fetchProductCardHTML);
    const responses = await Promise.all(requests);
    const wishlistProductCards = responses.join('');
    grid.innerHTML = wishlistProductCards;
    grid.classList.add(GRID_LOADED_CLASS);
    initButtons();

    const event = new CustomEvent('shopify-wishlist:init-product-grid', {
        detail: { wishlist: wishlist }
    });
    document.dispatchEvent(event);
};

const setupButtons = (buttons) => {
    buttons.forEach((button) => {
        const productHandle = button.dataset.productHandle || false;
        if (!productHandle) return console.error('[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist.');
        if (wishlistContains(productHandle)) button.classList.add(BUTTON_ACTIVE_CLASS);
        button.addEventListener('click', () => {
            updateWishlist(productHandle);
            button.classList.toggle(BUTTON_ACTIVE_CLASS);
        });
    });
};

const initGrid = () => {
    const grid = document.querySelector(selectors.grid) || false;
    if (grid) setupGrid(grid);
};

const initButtons = () => {
    const buttons = document.querySelectorAll(selectors.button) || [];
    if (buttons.length) setupButtons(buttons);
    else return;
    const event = new CustomEvent('shopify-wishlist:init-buttons', {
        detail: { wishlist: getWishlist() }
    });
    document.dispatchEvent(event);
};

const getWishlist = () => {
    const wishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY) || false;
    if (wishlist) return wishlist.split(LOCAL_STORAGE_DELIMITER);
    return [];
};

const setWishlist = (array) => {
    const wishlist = array.join(LOCAL_STORAGE_DELIMITER);
    if (array.length) localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlist);
    else localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);

    const event = new CustomEvent('shopify-wishlist:updated', {
        detail: { wishlist: array }
    });
    document.dispatchEvent(event);

    return wishlist;
};

const updateWishlist = (handle) => {
    const wishlist = getWishlist();
    const indexInWishlist = wishlist.indexOf(handle);
    if (indexInWishlist === -1) wishlist.push(handle);
    else wishlist.splice(indexInWishlist, 1);
    return setWishlist(wishlist);
};

const wishlistContains = (handle) => {
    const wishlist = getWishlist();
    return wishlist.includes(handle);
};

const resetWishlist = () => {
    return setWishlist([]);
};