const cartCount = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const whatsappOrderLink = document.getElementById('whatsapp-order');
const themeToggle = document.querySelector('.theme-toggle');
const cartButton = document.querySelector('.mini-cart');
const closeModalButton = document.querySelector('.close-modal');
const continueShoppingButton = document.querySelector('.checkout-close');
const miniAddButtons = document.querySelectorAll('.mini-add-btn');
const addButtons = document.querySelectorAll('.add-btn');

let cart = [];

const formatCurrency = (amount) =>
  `GH₵ ${new Intl.NumberFormat('en-GH', {
    maximumFractionDigits: 0,
  }).format(amount)}`;

const getProductQuantity = (productCard) => {
  const qtyValue = productCard.querySelector('.qty-value');
  return Number(qtyValue?.textContent || '1');
};

const setProductQuantity = (productCard, quantity) => {
  const qtyValue = productCard.querySelector('.qty-value');
  if (!qtyValue) return;
  qtyValue.textContent = Math.max(1, quantity);
};

const updateCartUI = () => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    cartTotal.textContent = 'GH₵ 0';
    whatsappOrderLink.href = '#';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartTotal.textContent = formatCurrency(total);

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <small>${item.quantity} x ${formatCurrency(item.price)}</small>
          </div>
          <strong>${formatCurrency(item.quantity * item.price)}</strong>
        </div>
      `
    )
    .join('');

  const message = cart
    .map((item) => `${item.name} (${item.quantity})`)
    .join(', ');

  whatsappOrderLink.href = `https://wa.me/233203244052?text=${encodeURIComponent(`Hello Najah Cocoa Products, I would like to order: ${message}. Total: ${formatCurrency(total)}`)}`;
};

const addToCart = (name, price, quantity = 1) => {
  const existingProduct = cart.find((item) => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  updateCartUI();
};

const openCartModal = () => {
  checkoutModal.classList.remove('hidden');
  checkoutModal.setAttribute('aria-hidden', 'false');
};

const closeCartModal = () => {
  checkoutModal.classList.add('hidden');
  checkoutModal.setAttribute('aria-hidden', 'true');
};

const toggleTheme = () => {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? 'light' : 'dark';
  themeToggle.textContent = isDark ? 'Dark luxury' : 'Light mode';
};

cartButton.addEventListener('click', openCartModal);
closeModalButton.addEventListener('click', closeCartModal);
continueShoppingButton.addEventListener('click', closeCartModal);
checkoutModal.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') {
    closeCartModal();
  }
});

themeToggle.addEventListener('click', toggleTheme);

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const productName = productCard?.dataset.name || 'Product';
    const productPrice = Number(productCard?.dataset.price || 0);
    const quantity = getProductQuantity(productCard);

    addToCart(productName, productPrice, quantity);
    openCartModal();

    button.textContent = 'Added';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = 'Add to cart';
      button.disabled = false;
    }, 700);
  });
});

miniAddButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.name || 'Product';
    const productPrice = Number(button.dataset.price || 0);
    addToCart(productName, productPrice, 1);
    openCartModal();
  });
});

document.querySelectorAll('.qty-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const productCard = button.closest('.product-card');
    const qtyValue = productCard.querySelector('.qty-value');
    let currentQty = Number(qtyValue.textContent || '1');

    if (button.classList.contains('increment')) {
      currentQty += 1;
    } else {
      currentQty = Math.max(1, currentQty - 1);
    }

    qtyValue.textContent = currentQty;
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !checkoutModal.classList.contains('hidden')) {
    closeCartModal();
  }
});

updateCartUI();
