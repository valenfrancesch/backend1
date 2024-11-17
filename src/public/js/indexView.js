document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones con la clase "deleteBtn"
    const buttons = document.querySelectorAll('.deleteBtn');

    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id; 
            const cartId = sessionStorage.getItem('cid');

            try {
                let response;
                if (cartId) {
                    response = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
                        method: 'POST',
                    });
                    if(response.ok){
                        alert("Producto agregado al carrito exitosamente.")
                    }
                } else {
                    response = await fetch('api/carts/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            products: [{ product: productId, quantity: 1 }], 
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sessionStorage.setItem('cid', data.carts._id);
                        alert("Producto agregado al carrito exitosamente.")
                    }
                }

                
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                alert('Ocurrió un error al procesar tu solicitud.');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const carritoLink = document.getElementById('carritoLink');
    const cartId = sessionStorage.getItem('cid'); 
    if (cartId) {
        carritoLink.href = `/carts/${cartId}`; 
    } else {
        carritoLink.href = '/nocart'; //si no existe cartId
    }
});