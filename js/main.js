const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const cardsRestaurants = document.querySelector('.cards-restaurants');

function openModalAuth() {
  loginInput.value = '';
  passwordInput.value = '';
  modalAuth.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModalAuth() {
  modalAuth.classList.remove('is-open');
  document.body.style.overflow = '';
}

// Highlight field with error
function markInvalidField(field) {
  field.classList.add('error');
}

// Clear error highlight
function clearInvalidField(field) {
  field.classList.remove('error');
}

function checkAuth() {
  const login = localStorage.getItem('login');
  if (login) {
    logIn(login);
  } else {
    logOut();
  }
}

function logIn(login) {
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  closeModalAuth();
}

function logOut() {
  localStorage.removeItem('login');
  userName.textContent = '';
  userName.style.display = 'none';
  buttonAuth.style.display = 'block';
  buttonOut.style.display = 'none';
}

function createCard({ image, title, time, price, category, rating }) {
  const card = document.createElement('a');
  card.classList.add('card', 'card-restaurant');
  card.dataset.restaurant = JSON.stringify({ title, price, category, rating });
  card.innerHTML = `
    <img src="${image}" alt="${title}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${title}</h3>
        <span class="card-tag tag">${time}</span>
      </div>
      <div class="card-info">
        <div class="rating">${rating}</div>
        <div class="price">від ${price} ₴</div>
        <div class="category">${category}</div>
      </div>
    </div>
  `;

  card.addEventListener('click', (event) => {
    event.preventDefault();
    if (!localStorage.getItem('login')) {
      openModalAuth();
    } else {
      localStorage.setItem('selectedRestaurant', card.dataset.restaurant);
      window.location.href = 'restaurant.html';
    }
  });

  return card;
}

function renderCards(data) {
  data.forEach((restaurant) => {
    const card = createCard(restaurant);
    cardsRestaurants.append(card);
  });
}

logInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  if (!loginInput.value.trim()) {
    markInvalidField(loginInput);
    valid = false;
  } else {
    clearInvalidField(loginInput);
  }

  if (!passwordInput.value.trim()) {
    markInvalidField(passwordInput);
    valid = false;
  } else {
    clearInvalidField(passwordInput);
  }

  if (valid) {
    localStorage.setItem('login', loginInput.value.trim());
    logIn(loginInput.value.trim());
  }
});

buttonAuth.addEventListener('click', () => {
  clearInvalidField(loginInput);
  clearInvalidField(passwordInput);
  openModalAuth();
});

closeAuth.addEventListener('click', closeModalAuth);
buttonOut.addEventListener('click', logOut);

const restaurants = [
  {
    image: 'img/pizza-plus/preview.jpg',
    title: 'Піца плюс',
    time: '50 хвилин',
    price: '200',
    category: 'Піца',
    rating: '4.5',
  },
  {
    image: 'img/tanuki/preview.jpg',
    title: 'Танукі',
    time: '60 хвилин',
    price: '1200',
    category: 'Суші, роли',
    rating: '4.5',
  },
  {
    image: 'img/food-band/preview.jpg',
    title: 'FoodBand',
    time: '40 хвилин',
    price: '150',
    category: 'Піца',
    rating: '4.5',
  },
  {
    image: 'img/food-band/preview.jpg',
    title: 'TEST',
    time: 'TEST хвилин',
    price: '9999',
    category: 'TEST',
    rating: '999',
  },
];

renderCards(restaurants);

checkAuth();
