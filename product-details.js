document.addEventListener('DOMContentLoaded', function () {
    // Fetch na osnovu imena
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');

    fetch(`https://65b794c446324d531d54f899.mockapi.io/api/30hills/products?name=${productName}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                displayProductDetails(data[0]);
            } else {
                console.error('Product details not found.');
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
});

function displayProductDetails(product) {

    document.getElementById('product-details-category').innerText = `${product.category}`;
    document.getElementById('product-details-name').innerText = product.name;
    document.getElementById('product-details-image').src = product.images && product.images.length > 0 ? product.images[0] : 'img/noimage.jpg';
    
    const priceSubstring = product.price.substring(1);
    //const formattedPrice = typeof priceSubstring === 'number' ? `$${priceSubstring}` : 'Price not available';
    document.getElementById('product-details-price').innerText = `$${parseFloat(priceSubstring)}`;

    document.getElementById('product-details-description').innerText = `${product.description}`;
}

function closeProductDetails() {
    window.close(); // Klikom na dugme zatvara se prozor
}


