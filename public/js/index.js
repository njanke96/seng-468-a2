function orderBook(button, isbn, title, author, quantity) {
    button.classList.add('is-loading');

    // all other params are strings
    let numQuantity = parseInt(quantity)

    // make invalid quantities 1
    numQuantity = isNaN(numQuantity) ? 1 : numQuantity;
    numQuantity = numQuantity < 1 ? 1 : numQuantity;

    fetch('/orders/submit', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({isbn, title, author, quantity: numQuantity}),
    })
        .then(response => {
            console.log(response)
            if (response.status === 200) {
                // don't care about the response
                window.location.replace('/orderconfirm.html')
            } else {
                console.error('Non-zero response code from /orders/submit')
            }
        })
        .catch(err => console.error(err));
}

(function() {
    // the books are hard coded

    // get book buttons and quantities
    const b1 = document.getElementById('b1');
    const b2 = document.getElementById('b2');
    const b3 = document.getElementById('b3');
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');

    // button click handlers
    b1.addEventListener("click",
        () => orderBook(b1, "9780062079305", "Guy Fieri Food", "Guy Fieri", q1.value)
    );

    b2.addEventListener("click",
        () => orderBook(b2,"9780062244741", "Guy Fieri Family Food", "Guy Fieri", q2.value)
    );

    b3.addEventListener("click",
        () => orderBook(b3,"9780061964503", "Diners, Drive-ins and Dives", "Guy Fieri", q3.value)
    );
})();