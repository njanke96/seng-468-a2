(function() {
    // get order status elements
    const orderId = document.getElementById('orderId');
    const isbn = document.getElementById('isbn');
    const bookTitle = document.getElementById('bookTitle');
    const bookAuthor = document.getElementById('bookAuthor');
    const orderQuantity = document.getElementById('orderQuantity');
    const orderTime = document.getElementById('orderTime');

    // loading and order info
    const loading = document.getElementById('loading');
    const orderInfo = document.getElementById('orderInfo');

    // fetch
    fetch('/orders/last').then(response => response.json())
        .then(data => {
           orderId.innerText = data.id || '0';
           isbn.innerText = data.isbn;
           bookTitle.innerText = data.title;
           bookAuthor.innerText = data.author;
           orderQuantity.innerText = '' + data.quantity;
           orderTime.innerText = data.timestamp;

           loading.classList.add("is-hidden");
           orderInfo.classList.remove("is-hidden");
        });
})();