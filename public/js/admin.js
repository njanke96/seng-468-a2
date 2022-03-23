function eltxt(text) {
    return document.createTextNode('' + text);
}

(function() {
    // get order status elements
    const orderTable = document.getElementById('orderTable');

    // fetch order list and add to table
    fetch('/orders/history').then(response => response.json())
        .then(data => {
            data.orderList.forEach(order => {
                const row = document.createElement('tr');

                const id = document.createElement('td');
                id.appendChild(eltxt(order.id));

                const isbn = document.createElement('td');
                isbn.appendChild(eltxt(order.isbn));

                const title = document.createElement('td');
                title.appendChild(eltxt(order.title));

                const author = document.createElement('td');
                author.appendChild(eltxt(order.author));

                const quantity = document.createElement('td');
                quantity.appendChild(eltxt(order.quantity));

                const timestamp = document.createElement('td');

                // timestamp formatting
                const date = new Date(order.timestamp * 1000);
                timestamp.appendChild(eltxt(date.toLocaleString()));

                row.appendChild(id);
                row.appendChild(isbn);
                row.appendChild(title);
                row.appendChild(author);
                row.appendChild(quantity);
                row.appendChild(timestamp);

                orderTable.appendChild(row);
            });
        });
})();
