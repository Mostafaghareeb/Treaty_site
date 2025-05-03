class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.count = this.calculateCount();
    this.cartCountElement = document.getElementById("cartCount");
    this.initializeEventListeners();
    this.updateCartDisplay();
  }

  initializeEventListeners() {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (e) => this.addToCart(e));
    });

    // Cart page specific elements
    if (document.getElementById("cartItems")) {
      this.renderCartItems();
      this.updateOrderSummary();
    }
  }

  calculateCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(event) {
    const button = event.currentTarget;
    const product = {
      id: button.dataset.productId,
      name: button.dataset.productName,
      price: parseFloat(button.dataset.productPrice),
      image: button.dataset.productImage,
      quantity: 1,
    };

    // Check if product already exists in cart
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push(product);
    }

    this.saveCart();
    this.count = this.calculateCount();
    this.updateCartDisplay();

    // Animation feedback
    button.textContent = "Added!";
    button.classList.add("bg-green-600");
    setTimeout(() => {
      button.textContent = "Add to Cart";
      button.classList.remove("bg-green-600");
    }, 2000);

    // Show success message
    this.showSuccessMessage("Product added to cart!");
  }

  updateCartDisplay() {
    if (this.cartCountElement) {
      this.cartCountElement.textContent = this.count;
      this.cartCountElement.classList.toggle("opacity-0", this.count === 0);
    }
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const checkoutButton = document.getElementById("checkoutButton");

    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = "";
      if (emptyCartMessage) {
        emptyCartMessage.classList.remove("hidden");
      }
      this.updateOrderSummary(true); // Pass true to reset summary
      if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.classList.add("opacity-50", "cursor-not-allowed");
      }
      return;
    }

    if (emptyCartMessage) {
      emptyCartMessage.classList.add("hidden");
    }

    cartItemsContainer.innerHTML = this.items
      .map(
        (item) => `
            <div class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between" data-product-id="${
              item.id
            }">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${
          item.name
        }" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h3 class="font-semibold">${item.name}</h3>
                        <p class="text-gray-600">LE ${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <button class="quantity-btn bg-gray-200 px-3 py-1 rounded-full" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn bg-gray-200 px-3 py-1 rounded-full" data-action="increase">+</button>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-700">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    // Add event listeners to quantity buttons and remove buttons
    cartItemsContainer.querySelectorAll(".quantity-btn").forEach((button) => {
      button.addEventListener("click", (e) => this.updateQuantity(e));
    });

    cartItemsContainer.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => this.removeItem(e));
    });

    this.updateOrderSummary();
  }

  updateQuantity(event) {
    const button = event.currentTarget;
    const action = button.dataset.action;
    const productElement = button.closest("[data-product-id]");
    const productId = productElement.dataset.productId;
    const item = this.items.find((item) => item.id === productId);

    if (action === "increase") {
      item.quantity++;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity--;
    }

    this.saveCart();
    this.count = this.calculateCount();
    this.updateCartDisplay();
    this.renderCartItems();
  }

  removeItem(event) {
    const productElement = event.currentTarget.closest("[data-product-id]");
    const productId = productElement.dataset.productId;
    this.items = this.items.filter((item) => item.id !== productId);

    this.saveCart();
    this.count = this.calculateCount();
    this.updateCartDisplay();
    this.renderCartItems();
  }

  updateOrderSummary(reset = false) {
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    if (!subtotalElement) return;

    if (reset) {
      subtotalElement.textContent = "LE 0.00";
      taxElement.textContent = "LE 0.00";
      totalElement.textContent = "LE 0.00";
      return;
    }

    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    subtotalElement.textContent = `LE ${subtotal.toFixed(2)}`;
    taxElement.textContent = `LE ${tax.toFixed(2)}`;
    totalElement.textContent = `LE ${total.toFixed(2)}`;
  }

  showSuccessMessage(message) {
    const successMessage = document.createElement("div");
    successMessage.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    successMessage.textContent = message;
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  }
}

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cart = new ShoppingCart();
});
