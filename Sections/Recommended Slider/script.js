getProducts(window.Shopify.routes.root + "recommendations/products.json?product_id={{ product.id }}&limit=20&intent=related")

async function getProducts(api) {
    let response = await fetch(api);

    let data = await response.json();

    let swiperWrapper = document.getElementById('slider')

  const products = data.products
  
    for (var i = 0; i < products.length; i++) {
       
        let div = document.createElement('div')
        div.className = 'swiper-slide'
        let product = products[i]

        const contentDiv = `
          <div class="product-wrap" id="product-wrap-${product.id}">
          <a href="${product.url}">
            <img src="${product.featured_image}" alt="${product.title}" class="he-img-responsive" />
            <h3 class="he-product-title">${product.title}</h3>
            </a>
          </div>
        `   
          div.innerHTML = contentDiv
      
        swiperWrapper.appendChild(div)

    }
}
