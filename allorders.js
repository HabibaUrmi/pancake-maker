document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", loadOrders);
  loadOrders();
});

function loadOrders() {
  console.log("Loading orders...");

  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) {
    console.error("Orders container element not found!");
    return;
  }
  ordersContainer.innerHTML = "";

  let orders = getOrders();
  console.log("Orders retrieved from localStorage:", orders);

  if (!orders.length) {
    displayMessage(ordersContainer, "No orders found.");
    return;
  }

  const filteredOrders = filterOrders(orders);
  const sortedOrders = sortOrders(filteredOrders);
  sortedOrders.forEach((order) => {
    ordersContainer.appendChild(createOrderCard(order));
  });

  console.log("Orders loaded successfully.");
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch (error) {
    console.error("Error parsing orders from localStorage", error);
    return [];
  }
}

function displayMessage(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

function filterOrders(orders) {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  return orders.filter((order) => {
    return (
      String(order.id).includes(searchQuery) ||
      order.customerName.toLowerCase().includes(searchQuery)
    );
  });
}

function sortOrders(orders) {
  const statusPriority = { waiting: 1, ready: 2, delivered: 3 };
  return orders.sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  );
}

function createOrderCard(order) {
  const card = document.createElement("div");
  card.className = `order-card ${order.status}`;

  const elements = [
    createElement("h2", `Order #${order.id}`),
    createParagraph("Customer", order.customerName),
    createParagraph("Pancake", order.selectedPancake),
    createParagraph("Toppings", order.toppings.join(", ") || "None"),
    createParagraph("Extras", order.extras.join(", ") || "None"),
    createParagraph("Delivery", order.deliveryMethod),
    createParagraph("Price", `€${order.totalPrice}`),
    createStatusSection(order),
  ];

  elements.forEach((element) => card.appendChild(element));

  if (order.status === "delivered") {
    const removeButton = createRemoveButton(order.id, card);
    card.appendChild(removeButton);
  }

  return card;
}

function createStatusSection(order) {
  const statusContainer = document.createElement("p");
  const statusLabel = createElement("strong", "Status: ");
  const statusText = createElement("span", order.status);
  statusText.className = "status-text";

  const statusDropdown = createStatusDropdown(
    order.id,
    order.status,
    statusText
  );
  statusContainer.append(statusLabel, statusText, statusDropdown);

  return statusContainer;
}

function createStatusDropdown(orderId, currentStatus, statusText) {
  const dropdown = document.createElement("select");
  ["waiting", "ready", "delivered"].forEach((status) => {
    const option = new Option(status, status, false, status === currentStatus);
    dropdown.add(option);
  });

  dropdown.onchange = () =>
    updateOrderStatus(orderId, dropdown.value, statusText);
  return dropdown;
}

function createRemoveButton(orderId, orderCard) {
  const button = document.createElement("button");
  button.textContent = "Remove Order";
  button.className = "remove-button";
  button.onclick = () => removeOrder(orderId, orderCard);
  return button;
}

function createParagraph(label, value) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${label}:</strong> ${value}`;
  return p;
}

function createElement(tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

function updateOrderStatus(orderId, newStatus, statusText) {
  let orders = getOrders();
  orders = orders.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order
  );
  localStorage.setItem("orders", JSON.stringify(orders));

  statusText.textContent = newStatus;
  loadOrders();
}

function removeOrder(orderId, orderCard) {
  let orders = getOrders();

  const newOrders = orders.filter(
    (order) => String(order.id) !== String(orderId)
  );

  localStorage.setItem("orders", JSON.stringify(newOrders));

  if (orderCard) orderCard.remove();
  console.log("Order removed!");
}

document.getElementById("searchInput").addEventListener("input", loadOrders);
