"use strict";

const body = document.querySelector("body");
const cart = document.querySelector(".cart");
const hidden = document.querySelector(".holder");
const increment = document.querySelector(".increment");
const decrement = document.querySelector(".decrement");
const text = document.querySelector(".text");
const image = document.querySelector(".image");
const button = document.querySelector(".btn");
const entries = document.querySelector(".entries");
const arrImages = document.querySelectorAll(".images img");

// // To display the image in the item div
// function showImage() {
//   // console.log(arrImages[i].src);

//   next.addEventListener("click", () => {
//     for (let i = 0; i < arrImages.length; i++) {
//       item.innerHTML = "";
//       const image = document.createElement("img");
//       image.src = arrImages[i].src;
//       item.innerHTML = image;
//     }
//   });
// }

// showImage();

// Links for the closeBtn
const originalSrc = `./images/icon-close.svg`;
const newSrc = `./images/icon-close-new.svg`;

// Links for the prevBtn
const newLink = `./images/icon-previous-2.svg`;
const oldLink = `./images/icon-previous.svg`;

// Links for the nextBtn
const origin = `./images/icon-next-2.svg`;
const now = `./images/icon-next.svg`;

// Toggle cart visibility
cart.addEventListener("click", () => {
  hidden.classList.toggle("hidden");
});

// Add overlay content and display overlay
function displayItem() {
  // Check if .contained div already exists
  let contained = document.querySelector(".contained");
  if (!contained) {
    const html = `
      <div class="contained">
        <button class="close-btn">
          <img src="./images/icon-close.svg" alt="icon-close" />
        </button>
        <div class="item"></div>
        <button class="left-control">
          <img src="./images/icon-previous.svg" alt="icon-previous" />
        </button>
        <button class="right-control">
          <img src="./images/icon-next.svg" alt="icon-next" />
        </button>
        <div class="image">
          <div class="images">
            <img src="./images/image-product-1.jpg" alt="image-product-1" />
          </div>
          <div class="images">
            <img src="./images/image-product-2.jpg" alt="image-product-2" />
          </div>
          <div class="images">
            <img src="./images/image-product-3.jpg" alt="image-product-3" />
          </div>
          <div class="images">
            <img src="./images/image-product-4.jpg" alt="image-product-4" />
          </div>
        </div>
      </div>`;

    body.insertAdjacentHTML("beforeend", html);
    contained = document.querySelector(".contained");

    // Add event listener for the buttons
    const closeBtn = contained.querySelector(".close-btn");
    const closeImg = closeBtn.querySelector("img");
    const previous = contained.querySelector(".left-control");
    const prevImg = previous.querySelector("img");
    const next = contained.querySelector(".right-control");
    const nextImg = next.querySelector("img");
    const item = contained.querySelector(".item");

    closeBtn.addEventListener("click", hideOverlay);

    // Change color of the buttons when hovered
    function changeColor(button, image, link1, link2) {
      button.addEventListener("mouseover", (e) => {
        e.stopPropagation();
        image.src = link1;
      });

      button.addEventListener("mouseout", (e) => {
        e.stopPropagation();
        image.src = link2;
      });
    }
    changeColor(previous, prevImg, newLink, oldLink);
    changeColor(closeBtn, closeImg, newSrc, originalSrc);
    changeColor(next, nextImg, origin, now);

    // Display the overlay with blur and darkening effect
    showOverlay();
  }
}

// Function to show overlay with blur and dark overlay
function showOverlay() {
  // Create and append dark overlay if not present
  let darkOverlay = document.querySelector(".dark-overlay");
  if (!darkOverlay) {
    const overlayDiv = document.createElement("div");
    overlayDiv.classList.add("dark-overlay");
    body.appendChild(overlayDiv);

    // Add click event to dark overlay to hide overlay
    overlayDiv.addEventListener("click", hideOverlay);
  }

  document.querySelector(".contained").classList.add("show");
  document.querySelector(".blur-container").classList.add("blur");
  darkOverlay.style.display = "block"; // Show dark overlay
  body.classList.add("no-scroll"); // Prevent body scrolling
}

// Function to hide overlay and remove blur and dark overlay
function hideOverlay() {
  const contained = document.querySelector(".contained");
  const darkOverlay = document.querySelector(".dark-overlay");
  if (contained) {
    contained.classList.remove("show");
    document.querySelector(".blur-container").classList.remove("blur");
    darkOverlay.style.display = "none"; // Hide dark overlay
    body.classList.remove("no-scroll"); // Allow body scrolling again
    contained.remove(); // Remove the contained div from the DOM
  }
}

// Add click event to the image to display the overlay
image.addEventListener("click", (e) => {
  e.stopPropagation();
  displayItem();
});

// Hide overlay on pressing Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideOverlay();
  }
});

// Function to increase and decrease the item number
function addCounterListener() {
  let quantity = 0;
  increment.addEventListener("click", () => {
    quantity++;
    text.innerHTML = quantity;
  });

  decrement.addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      text.innerHTML = quantity;
    }
  });
}

// To add item to the cart
button.addEventListener("click", () => {
  const cartItems = hidden.querySelector(".cart-item");

  if (!cartItems) {
    hidden.classList.remove("hidden");
    entries.remove();
    const html = `<div class="cart-item">
      <div class="upper">
        <div class="start">
          <img src="./images/image-product-1.jpg" alt="image-product-1" />
        </div>
        <div class="middle">
          <div class="used">
            <p>Fall Limited Edition Sneakers</p>
          </div>
          <div class="priced">
            <p class="tag">$${parseFloat(125).toFixed(2)}</p>
            <p>x <span class="amount">3</span></p>
            <p class="total">$${parseFloat(375).toFixed(2)}</p>
          </div>
        </div>
        <div class="end">
          <img src="./images/icon-delete.svg" alt="icon-delete" />
        </div>
      </div>
      <div class="bottom">Checkout</div>
    </div>`;
    hidden.innerHTML += html;

    const newElement = cartItems.querySelector(".end");
    newElement.addEventListener("click", () => {
      removeCartItem(itemName, cartItems);
    });
  }
});

// To remove cart-item
function removeCartItem(itemName, cartElement) {
  // Find the index of the item to remove
  const itemIndex = cartItems.findIndex((item) => item.name === itemName);

  if (itemIndex !== -1) {
    // Remove the item from the cartItems array
    cartItems.splice(itemIndex, 1);

    // Remove the corresponding element from the DOM
    cartElement.remove();

    // Update the total price after removal
    // updateTotalPrice();
  }
}

addCounterListener();
