document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalContainer = document.querySelector('.total');
    let products;

    // Fetch za JSON fajl sa servera

    fetch('https://65b794c446324d531d54f899.mockapi.io/api/30hills/products')
        .then(response => response.json())
        .then(data => {

            products = data;

            // Za svaki element generiše se HTML

            const itemsContainer = document.querySelector('.items');

            products.forEach(product => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('single-item');

                // Prikazivanje prve slike iz niza slika svakog proizvoda
                const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'img/noimage.jpg';

                // Dodavanje novog HTML-a, odnosno prikaz proizvoda
                itemDiv.innerHTML = `
                    <img src="${imageUrl}">
                    <div class="si-content">
                        <h3>${product.name}<br></h3>
                        <p><b>Category: ${product.category}</b><br><br><p>
                        <p class="description">${product.description}<br><br></p>
                        <p class="price">$${product.price}<br><br></p>
                    </div>
                    <div class="actions">
                        <input type="number" name="quantity" value="0" min="0">
                        <button data-product-name="${product.name}" data-product-price="${product.price}" onclick="addToCart(this)">Add</button>
                        <button onclick="showDetails(this)">Details</button>
                    </div>
                `;

                itemsContainer.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

// Dodavanje u korpu
function addToCart(button) {
    const productName = button.dataset.productName;
    const productPrice = parseFloat(button.dataset.productPrice);
    const productContainer = button.closest('.single-item');
    const quantityInput = productContainer.querySelector('.actions input');
    const quantity = parseInt(quantityInput.value);

    if (quantity > 0) {
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.dataset.name = productName;

        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-quantity">${quantity} x ${productPrice.toFixed(2)}<br><br></p>
                <p class="cart-product-name">${productName}<br><br></p>
                <button onclick="removeFromCart(this)">Remove</button>
            </div>
            <p class="cart-total-price"><b>$${(quantity * productPrice).toFixed(2)}</b></p>
        `;

        document.querySelector('.cart-items').appendChild(cartItemDiv);
        
        updateTotalPrice();
        button.disabled = true;
    } else {
        alert('Please select a valid quantity (greater than 0) before adding to the cart.');
    }
}

// Uklanjanje iz korpe
function removeFromCart(button) {
    const cartItem = button.closest('.cart-item');
    const productName = cartItem.dataset.name;

    const productContainer = Array.from(document.querySelectorAll('.single-item')).find(item => {
        const nameElement = item.querySelector('.si-content h3');
        return nameElement && nameElement.innerText.trim() === productName.trim();
    });

    // Enableovanje "Add to Cart" dugmeta
    if (productContainer) {
        const addToCartButton = productContainer.querySelector('.actions button');
        addToCartButton.disabled = false;
    }

    // Brisanje i ažuriranje ukupne cene
    cartItem.remove();
    updateTotalPrice();
}



// Ažuriranje ukupne cene svih proizvoda u korpi
function updateTotalPrice() {
    const cartTotalPriceElements = Array.from(document.querySelectorAll('.cart-total-price'));
    const totalContainer = document.querySelector('.total');
    const totalPrice = cartTotalPriceElements.reduce((total, element) => total + parseFloat(element.innerText.replace('$', '')), 0);
    totalContainer.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    const items = document.querySelectorAll('.single-item');

    // Provera da li je kriterijum prazan
    if (searchTerm !== '') {
        let found = false;

        items.forEach(item => {
            const nameElement = item.querySelector('.si-content h3');
            const descriptionElement = item.querySelector('.si-content .description');

            if (nameElement && descriptionElement) {
                const name = nameElement.innerText.toLowerCase();
                const description = descriptionElement.innerText.toLowerCase();

                if (name.includes(searchTerm) || description.includes(searchTerm)) {
                    found = true;
                } else {
                    item.style.display = 'none';
                }
            } else {
                console.error('Name or description element not found for an item:', item);
            }

            if (!found && nameElement && descriptionElement) {
                item.style.display = '';
            }
        });

        // Ukoliko nije pronadjen nijedan proizvod sa unetim kriterijumom
        if (!found) {
            alert('No products match the search criteria!');
        }
    } else {
        // Ako je prazna pretraga, prikazati sve proizvode
        items.forEach(item => item.style.display = '');
    }
}

// Uzimanje elementa iz HTML-a
const sortBySelect = document.querySelector('#sortBySelect');

// Funkcija sortiranja
function sortProducts(sortBy) {
  
  const productItems = Array.from(document.querySelectorAll('.single-item'));

  // Biram opciju
  productItems.sort((a, b) => {
    const aPrice = parseFloat(a.querySelector('.price').innerText.replace('$', ''));
    const bPrice = parseFloat(b.querySelector('.price').innerText.replace('$', ''));

    if (sortBy === 'price-asc') {
      return aPrice - bPrice;
    } else if (sortBy === 'price-desc') {
      return bPrice - aPrice;
    }
  });

  // Uklanjanje svih elemenata iz containera
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';

  // Vracanje svih elemenata u sortiranom redosledu
  productItems.forEach(productItem => {
    itemsContainer.appendChild(productItem);
  });
}

// Event listener za onchange dogadjaj
sortBySelect.addEventListener('change', () => {
  const sortBy = sortBySelect.value;
  sortProducts(sortBy);
});

function showDetails(button) {
    const productContainer = button.closest('.single-item');
    const productName = productContainer.querySelector('.si-content h3').innerText;

    // Otvaranje product-details.html stranice
    window.open(`product-details.html?name=${encodeURIComponent(productName)}`, '_blank');
}

