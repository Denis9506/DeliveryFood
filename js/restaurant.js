// Variables for authentication
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const userName = document.querySelector('.user-name');

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
}

function logOut() {
  localStorage.removeItem('login');
  userName.textContent = '';
  userName.style.display = 'none';
  buttonAuth.style.display = 'block';
  buttonOut.style.display = 'none';
}

// Event listeners for login/logout functionality
buttonAuth.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to main page for login
});

buttonOut.addEventListener('click', () => {
  logOut();
  window.location.href = 'index.html'; // Redirect to main page after logout
});

const restaurantName = document.querySelector('.restaurant-name');
const restaurantRating = document.querySelector('.restaurant-rating');
const restaurantPrice = document.querySelector('.restaurant-price');
const restaurantCategory = document.querySelector('.restaurant-category');
const menuContainer = document.querySelector('.cards-menu');

const selectedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant'));

if (selectedRestaurant) {
  const { name, price, kitchen, stars, products } = selectedRestaurant;

  restaurantName.textContent = name;
  restaurantRating.textContent = `Рейтинг: ${stars}`;
  restaurantPrice.textContent = `Середній чек: від ${price} ₴`;
  restaurantCategory.textContent = `Кухня: ${kitchen}`;

  fetch(`./db/${products}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching menu: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      renderMenu(data);
    })
    .catch((error) => {
      console.error('Error loading menu:', error);
    });
} else {
  console.error('No restaurant selected');
  restaurantName.textContent = 'Ресторан не обрано';
}

function renderMenu(menu) {
  menuContainer.innerHTML = ''; 
  menu.forEach(({ id, name, description, price, image }) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${image}" alt="${name}" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
        </div>
        <div class="card-info">
          <p class="ingredients">${description}</p>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">У кошик</span>
          </button>
          <strong class="card-price-bold">${price} ₴</strong>
        </div>
      </div>
    `;
    menuContainer.append(card);
  });
}

checkAuth();
