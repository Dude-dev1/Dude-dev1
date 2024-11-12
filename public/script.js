"use strict";

const container = document.querySelector(".container");
const grid = document.querySelector(".grid");
const orderQuantity = document.querySelector(".c-num-order");

// Array to store prices of selected items
let cartItems = [];

// Fetch data from the JSON file and display it
async function getData() {
  const response = await fetch("data.json");
  const data = await response.json();

  // Map over the data to create HTML for each item
  Object.entries(data).map(([index, { name, category, price, image }]) => {
    const html = `<div class="item">
      <div class="images">
        <img src="${image.desktop}" alt="image desktop" />
      </div>
      <div class="transform">
        <button class="cart" data-id="${index}" data-name="${name}" data-price="${price}" data-image="${
      image.desktop
    }">
          <div class="image">
            <img src="./assets/images/icon-add-to-cart.svg" alt="Cart" />
          </div>
          <p class="describe">Add to Cart</p>
        </button>
        <p class="category">${category}</p>
        <p class="name">${name}</p>
        <p class="price">$${price.toFixed(2)}</p>
      </div>
    </div>`;

    grid.innerHTML += html;
    container.appendChild(grid);
  });
}

// Event listener to conditionally call addItem only when activating the cart
grid.addEventListener("click", (e) => {
  const cartButton = e.target.closest(".cart");

  if (cartButton) {
    const isCartActive = cartButton.getAttribute("data-active") === "true";
    toggleCart(cartButton);
    if (!isCartActive) addItem(cartButton); // Call addItem only on initial activation
  }
});

// To toggle between different carts
function toggleCart(cartButton) {
  const isCartActive = cartButton.getAttribute("data-active") === "true";
  const item = cartButton.closest(".item").querySelector(".images img");

  if (!isCartActive) {
    cartButton.innerHTML = `<button class="cart-holder">
      <div class="circle decrement">
        <img src="./assets/images/icon-decrement-quantity.svg" alt="" />
      </div>
      <div class="display">1</div>
      <div class="circle increment">
        <img src="./assets/images/icon-increment-quantity.svg" alt="" />
      </div>
    </button>`;

    item.classList.add("border");
    cartButton.classList.add("cart-holder");
    cartButton.setAttribute("data-active", "true");

    addCounterListener(cartButton);
  } else {
    cartButton.innerHTML = `<div class="image">
      <img src="./assets/images/icon-add-to-cart.svg" alt="Cart" />
    </div>
    <p class="describe">Add to Cart</p>`;

    item.classList.remove("border");
    cartButton.classList.remove("cart-holder");
    cartButton.classList.add("cart");
    cartButton.setAttribute("data-active", "false");
  }
}

// Function to update the order quantity in the .red element
function updateOrderQuantity() {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderQuantityElement = document.querySelector(".red");
  if (orderQuantityElement) {
    orderQuantityElement.textContent = totalQuantity;
  }
}

// Update addItem function to only be called when the button is activated for the first time
function addItem(cartButton) {
  const rightPanel = document.querySelector(".right-panel");

  const itemName = cartButton.getAttribute("data-name");
  const itemPrice = parseFloat(cartButton.getAttribute("data-price"));
  const itemImage = cartButton.getAttribute("data-image");

  let existingItem = cartItems.find((item) => item.name === itemName);

  if (!existingItem) {
    existingItem = {
      name: itemName,
      price: itemPrice,
      quantity: 1,
      image: itemImage,
    };
    cartItems.push(existingItem);
  } else {
    existingItem.quantity += 1;
  }

  updateOrderQuantity(); // Update order quantity after adding item

  let containedDiv = rightPanel.querySelector(".contained");

  if (!containedDiv) {
    rightPanel.innerHTML = "";
    containedDiv = document.createElement("div");
    containedDiv.className = "contained";

    containedDiv.innerHTML = `<div class="space"><h1>Your Cart(<span class="red">0</span>)</h1></div>
      <div class="entries"></div>
      <div class="footer">
        <div class="header">
          <p class="total">Order Total</p>
          <p class="number">$${parseFloat(0).toFixed(2)}</p>
        </div>
        <div class="mid">
          <img src="./assets/images/icon-carbon-neutral.svg" alt="icon-carbon-neutral" />
          <p>This is a <span class="inline">carbon neutral</span> delivery</p>
        </div>
        <button class="btn">Confirm order</button>
      </div>`;

    rightPanel.appendChild(containedDiv);

    // Confirm order functionalitity
    containedDiv
      .querySelector(".btn")
      .addEventListener("click", showConfirmationOverlay);
  }

  const entriesDiv = containedDiv.querySelector(".entries");

  let cartItemElement = Array.from(
    entriesDiv.querySelectorAll(".cart-item")
  ).find(
    (element) => element.querySelector(".item-name").textContent === itemName
  );

  if (cartItemElement) {
    const quantityDisplay = cartItemElement.querySelector(".red");
    const totalDisplay = cartItemElement.querySelector(".last");
    quantityDisplay.textContent = `${existingItem.quantity}x`;
    totalDisplay.textContent = `$${(existingItem.quantity * itemPrice).toFixed(
      2
    )}`;
  } else {
    const newElement = document.createElement("div");
    newElement.className = "cart-item";

    newElement.innerHTML = `<div class="right">
      <div>
        <p class="item-name">${itemName}</p>
      </div>
      <div class="content-flex">
        <p><span class="red">1x</span></p>
        <p class="coloured">@ $${itemPrice.toFixed(2)}</p>
        <p class="last">$${itemPrice.toFixed(2)}</p>
      </div>
    </div>
    <div class="left">
      <img src="./assets/images/icon-remove-item.svg" alt="icon-remove-item" />
    </div>`;

    entriesDiv.appendChild(newElement);

    const order = newElement.querySelector(".red");
    addCounterListener(cartButton, order);

    const removeButton = newElement.querySelector(".left");
    removeButton.addEventListener("click", () => {
      removeCartItem(itemName, newElement);
    });
  }

  updateTotalPrice();
}

// To displaying the confirmation overlay
function showConfirmationOverlay() {
  // Calculate total order price
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Start building the overlay HTML
  let overlayHtml = `<div class="overlay">
        <div class="contain">
          <div class="img">
            <img
              src="./assets/images/icon-order-confirmed.svg"
              alt="icon-order-confirmed"
            />
          </div>
          <div class="display">
            <p class="confirm">Order Confirmed</p>
            <p class="thanks">We hope you enjoy your food</p>
          </div>
          <div class="entered">`;

  // Loop through each item in the cart to create HTML for each one
  cartItems.forEach(({ name, price, quantity, image }) => {
    const itemTotal = (price * quantity).toFixed(2);
    overlayHtml += `
      <div class="select">
        <div class="in">
          <img src="${image}" alt="image-${name}" />
        </div>
        <div class="contents-flex">
          <div class="item-name">${name}</div>
          <div class="flexed">
            <p><span class="red">${quantity}x</span></p>
            <p class="coloured">@ $${price.toFixed(2)}</p>
          </div>
        </div>
        <div class="final">$<span>${itemTotal}</span></div>
      </div>`;
  });

  // Add the order total section
  overlayHtml += `
            <div class="order-total">
              <p class="attribution">Order Total</p>
              <p class="total-amount">$${totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div class="close-overlay">Start new order</div>
      </div>
    </div>`;

  // Append overlay to the container or body
  document.body.insertAdjacentHTML("beforeend", overlayHtml);

  // Add overlay styling to prevent background scrolling
  document.body.classList.add("overlay-background");

  // Event listener to close overlay
  document
    .querySelector(".close-overlay")
    .addEventListener("click", hideConfirmationOverlay);
  document
    .querySelector(".close-overlay")
    .addEventListener("click", renderEmptyCart);
}

// Update addCounterListener to dynamically manage the cart item quantity
function addCounterListener(cartButton, itemElement) {
  const decrement = cartButton.querySelector(".decrement");
  const increment = cartButton.querySelector(".increment");
  const display = cartButton.querySelector(".display");

  let quantity = parseInt(display.textContent) || 1;
  display.textContent = quantity;

  increment.addEventListener("click", (e) => {
    e.stopPropagation();
    quantity++;
    display.textContent = quantity;
    if (itemElement) {
      itemElement.textContent = quantity + "x";
    }
    updateItemQuantity(cartButton.getAttribute("data-name"), quantity);
  });

  decrement.addEventListener("click", (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      quantity--;
      display.textContent = quantity;
      if (itemElement) {
        itemElement.textContent = quantity + "x";
      }
      updateItemQuantity(cartButton.getAttribute("data-name"), quantity);
    }
  });
}

// Function to render the empty cart HTML
function renderEmptyCart() {
  const rightPanel = document.querySelector(".right-panel");
  rightPanel.innerHTML = `
  <div class="space">
      <h1>Your Cart (<span class="c-num-order">0</span>)</h1>
  </div>
  <div class="contains">
      <div class="align">
        <img src="./assets/images/illustration-empty-cart.svg" alt="Empty" />
        <p>Your added items will appear here</p>
      </div>
    </div>`;
}

// Remove the item from the right panel
function removeCartItem(itemName, cartElement) {
  const itemIndex = cartItems.findIndex((item) => item.name === itemName);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    cartElement.remove();

    // Check if the cart is empty and render the empty cart HTML if true
    if (cartItems.length === 0) {
      renderEmptyCart();
    } else {
      updateOrderQuantity(); // Update order quantity after removing item
      updateTotalPrice();
    }
  }
}

// Update the item quantity
function updateItemQuantity(itemName, newQuantity) {
  const item = cartItems.find((item) => item.name === itemName);
  if (item) {
    item.quantity = newQuantity;
    updateOrderQuantity(); // Update order quantity after updating item quantity
    updateTotalPrice();
  }
}

// Update the total price
function updateTotalPrice() {
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const totalElement = document.querySelector(".number");
  totalElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function hideConfirmationOverlay() {
  // Remove overlay from DOM
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.remove();
  }
  document.body.classList.remove("overlay-background");

  //Reset everything to its intial state
}

// Fetch data and initialize the order quantity display
getData().then(updateOrderQuantity);
