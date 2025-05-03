class Checkout {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.init();
  }

  init() {
    // Redirect if cart has less than 2 items
    if (this.items.length < 1) {
      window.location.href = "cart.html";
      return;
    }

    this.renderOrderSummary();
    this.setupEventListeners();
  }

  renderOrderSummary() {
    const checkoutItems = document.getElementById("checkoutItems");

    // Render items
    checkoutItems.innerHTML = this.items
      .map(
        (item) => ` 
            <div class="flex items-center justify-between py-2">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                    <div>
                        <h3 class="font-semibold">${item.name}</h3>
                        <p class="text-gray-600">LE ${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <span class="font-semibold">LE ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `
      )
      .join("");

    // Calculate and update totals
    const subtotal = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById("checkout-subtotal").textContent = `LE ${subtotal.toFixed(2)}`;
    document.getElementById("checkout-tax").textContent = `LE ${tax.toFixed(2)}`;
    document.getElementById("checkout-total").textContent = `LE ${total.toFixed(2)}`;

    // Fill hidden inputs for the form submission
    document.getElementById("cart-items-input").value = JSON.stringify(this.items);
    document.getElementById("subtotal-input").value = subtotal;
    document.getElementById("tax-input").value = tax;
    document.getElementById("total-input").value = total;
  }

  setupEventListeners() {
    // Submit form event listener
    document.querySelector("form").addEventListener("submit", (event) => {
      // You can add any validation or additional steps here if necessary
      console.log("Form submitted!");
    });
  }
}

// Initialize checkout when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const checkout = new Checkout();
});
