document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.deleteBtn');

    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id; 
            const cartId = sessionStorage.getItem('cid');
            console.log(productId)
            try {
                let response;
                if (cartId) {
                    response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
                        method: 'DELETE',
                    });
                    console.log(response)
                    alert("Producto borrado exitosamente.")
                } else {
                    alert("Ocurrio un eror. Intentalo más tarde.")
                }

            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                alert('Ocurrió un error al procesar tu solicitud.');
            }
        });
    });
});