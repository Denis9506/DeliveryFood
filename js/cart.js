const modalCart = document.querySelector('.modal-cart');
const modalDialog = modalCart.querySelector('.modal-dialog-cart'); 
const modalBody = document.createElement('div');
modalBody.classList.add('modal-body');
modalDialog.appendChild(modalBody);

const modalFooter = document.createElement('div');
modalFooter.classList.add('modal-footer');
modalDialog.appendChild(modalFooter);

const modalPricetag = document.createElement('span');
modalPricetag.classList.add('modal-pricetag');
modalFooter.appendChild(modalPricetag);

const orderButton = document.createElement('button');
orderButton.classList.add('button-primary');
orderButton.classList.add('button');
orderButton.textContent = 'Оформити замовлення';
modalFooter.appendChild(orderButton);


const clearCartButton = document.createElement('button');
clearCartButton.classList.add('clear-cart');
clearCartButton.classList.add('button');
clearCartButton.textContent = 'Очистити';
modalFooter.appendChild(clearCartButton);

const cartCloseButton = modalCart.querySelector('.close');
const openCartButton = document.querySelector('#cart-button');

let cart = [];

openCartButton.addEventListener('click', () => {
  loadCart();
  renderCart();
  modalCart.classList.add('is-open');
});

cartCloseButton.addEventListener('click', () => {
  modalCart.classList.remove('is-open');
});

clearCartButton.addEventListener('click', () => {
  cart = [];
  renderCart();
  localStorage.setItem('cart', JSON.stringify(cart)); 
});

function renderCart() {
  modalBody.innerHTML = ''; 
  let total = 0;

  cart.forEach((item) => {
    const foodRow = document.createElement('div');
    foodRow.classList.add('food-row');
    foodRow.innerHTML = `
      <span class="food-name">${item.name}</span>
      <strong class="food-price">${item.price} ₴</strong>
      <div class="food-counter">
        <button class="counter-button" data-id="${item.id}" data-action="decrease">-</button>
        <span class="counter">${item.quantity}</span>
        <button class="counter-button" data-id="${item.id}" data-action="increase">+</button>
      </div>
    `;
    modalBody.append(foodRow);

    total += item.price * item.quantity;
  });

  modalPricetag.textContent = `${total} ₴`;

  if (cart.length === 0) {
    modalBody.innerHTML = '<p>Кошик порожній.</p>';
  }

}

modalBody.addEventListener('click', (event) => {
  const button = event.target;
  if (button.classList.contains('remove-item')) {
    const id = button.dataset.id;
    cart = cart.filter((item) => item.id !== id);
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart)); 
  }
});

modalBody.addEventListener('click', (event) => {
  const button = event.target;
  if (button.classList.contains('counter-button')) {
    const id = button.dataset.id;
    const action = button.dataset.action;

    const item = cart.find((item) => item.id === id);

    if (item) {
      if (action === 'increase') {
        item.quantity += 1;
      } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart = cart.filter((item) => item.id !== id);
        }
      }
      renderCart();
    }
    localStorage.setItem('cart', JSON.stringify(cart)); 
  }
});

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderCart();
  }
}

