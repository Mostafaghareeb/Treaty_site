document.addEventListener("DOMContentLoaded", () => {
  // Get order data from Django template context
  const orderData = {
    items: JSON.parse(localStorage.getItem("cart")) || [],
    subtotal: parseFloat(localStorage.getItem("orderSubtotal")) || 0,
    tax: parseFloat(localStorage.getItem("orderTax")) || 0,
    total: parseFloat(localStorage.getItem("orderTotal")) || 0,
  };

  if (orderData.items.length > 0) {
    displayOrderDetails(orderData);
    createConfetti();
    // Clear cart and order data after displaying
    localStorage.removeItem("cart");
    localStorage.removeItem("orderSubtotal");
    localStorage.removeItem("orderTax");
    localStorage.removeItem("orderTotal");
  } else {
    displayError();
  }
});

function displayOrderDetails(order) {
  // Display order items
  const orderItemsContainer = document.getElementById("orderItems");
  orderItemsContainer.innerHTML = order.items
    .map(
      (item) => `
          <div class="flex items-center justify-between">
              <div class="flex items-center">
                  <img src="${item.image}" alt="${
        item.name
      }" class="w-12 h-12 object-cover rounded-lg">
                  <div class="ml-4">
                      <div class="text-gray-900 font-medium">${item.name}</div>
                      <div class="text-sm text-gray-500">Quantity: ${
                        item.quantity
                      }</div>
                  </div>
              </div>
              <div class="text-gray-900">LE ${(
                item.price * item.quantity
              ).toFixed(2)}</div>
          </div>
      `
    )
    .join("");

  // Display totals
  document.getElementById(
    "orderSubtotal"
  ).textContent = `LE ${order.subtotal.toFixed(2)}`;
  document.getElementById("orderTax").textContent = `LE ${order.tax.toFixed(
    2
  )}`;
  document.getElementById("orderTotal").textContent = `LE ${order.total.toFixed(
    2
  )}`;
}

function createConfetti() {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
  ];
  const container = document.querySelector("main");

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = `absolute w-2.5 h-2.5 ${
      colors[Math.floor(Math.random() * colors.length)]
    } animate-confetti-fall`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(confetti);
  }
}

function displayError() {
  const mainContent = document.querySelector("main");
  mainContent.innerHTML = `
        <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">Oops!</h1>
            <p class="text-gray-600 mb-6">We couldn't find your order details. Please try again or contact support.</p>
            <a href="{% url 'index' %}" class="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200">
                Return to Home
            </a>
        </div>
    `;
}
