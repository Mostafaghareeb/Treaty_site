document.addEventListener("DOMContentLoaded", function () {
  const buyNowBtn = document.getElementById("buyNowBtn");
  const cartCount = document.getElementById("cartCount");

  let currentProduct = null;

  // Add to Cart button functionality
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling

      // Get product data from button attributes
      const productData = {
        id: this.dataset.productId,
        name: this.dataset.productName,
        price: parseFloat(this.dataset.productPrice),
        image: this.dataset.productImage,
        quantity: 1,
      };

      // Get existing cart or initialize empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product already exists in cart
      const existingItem = cart.find((item) => item.id === productData.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(productData);
      }

      // Save updated cart
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart count if cart instance exists
      if (window.cart) {
        window.cart.items = cart;
        window.cart.count = window.cart.calculateCount();
        window.cart.updateCartDisplay();
      }

      // Show success message and animate button
      this.textContent = "Added!";
      this.classList.add("bg-green-600");
      showSuccessMessage("Product added to cart!");

      setTimeout(() => {
        this.textContent = "Add to Cart";
        this.classList.remove("bg-green-600");
      }, 2000);
    });
  });

  // Product card click handler for details page
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't redirect if clicking the add to cart button
      if (e.target.closest(".add-to-cart")) {
        return;
      }

      const productId = this.querySelector(".add-to-cart").dataset.productId;
      window.location.href = `/details/${productId}`;
    });
  });

  // Buy Now button click handler
  buyNowBtn.addEventListener("click", function () {
    if (currentProduct) {
      // Clear existing cart and add only the current product
      const cart = [
        {
          name: currentProduct.name,
          price: currentProduct.price,
          image: currentProduct.image,
          quantity: 1,
        },
      ];

      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart count
      updateCartCount();

      // Redirect to checkout
      window.location.href = "checkout.html";
    }
  });

  // Function to update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    cartCount.textContent = totalItems;
    cartCount.classList.remove("opacity-0");
  }

  // Function to show success message
  function showSuccessMessage(message) {
    const successMessage = document.createElement("div");
    successMessage.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    successMessage.textContent = message;
    document.body.appendChild(successMessage);

    // Remove message after 3 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  }

  // Initialize cart count
  updateCartCount();
});
