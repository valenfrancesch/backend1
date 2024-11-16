const socket = io()

document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        status: document.getElementById('status').value,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: []
    };

    console.log(product)

    socket.emit('addProduct', product)

    //Vaciar el form
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('status').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
});

const deleteButtons = document.querySelectorAll('.deleteBtn');
deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const pid = event.target.getAttribute('data-id')
        socket.emit('deleteProduct', { pid })
    });
});

socket.on('newProduct', data => {
    console.log("Cliente: llego nuevo producto")
    console.log(data)
    let { _id, title, description, code, price, status, stock, category, thumbnails } = data.newProduct
    let productsContainer = document.getElementById("productsContainer");
    let card = document.createElement("div")
    card.classList.add("product-card");
    card.setAttribute("data-id", _id);
    card.innerHTML = `<p><strong>${title}</strong><i>$${price}</i></p>
        <p>Categoría: ${category}</p>
        <p>Código: ${code}</p>
        <p>Stock: ${stock}</p>
        <p>Status: ${status}</p>
        <p>Descripción: ${description}</p>
        <button class="deleteBtn" style="background-color:red; color:white;" data-id="${_id}">Eliminar producto</button>`

    const deleteButton = card.querySelector('.deleteBtn');

    deleteButton.addEventListener('click', (event) => {
        const pid = event.target.getAttribute('data-id')
        socket.emit('deleteProduct', { pid });
    });

    productsContainer.append(card)
})

socket.on('productDeleted', ({ _id }) => {
    console.log(_id)
    const productCard = document.querySelector(`.product-card[data-id="${_id}"]`);
    if (productCard) {
        productCard.remove();
    }
})