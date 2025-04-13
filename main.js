const typeSelect = document.getElementById("type");
const toppings = document.querySelectorAll(".topping");
const extras = document.querySelectorAll(".extra");
const totalPriceDisplay = document.getElementById("totalPriceDisplay");
const totalPriceBanner = document.getElementById("totalPrice");
const form = document.getElementById("pancakeForm");
const seeOrderButton = document.getElementById("seeOrder");
const customerName = document.getElementById("customerName");
const summaryText = document.getElementById("summaryText");
const confirmOrderButton = document.getElementById("confirmOrderButton");
const orderSummary = document.getElementById("orderSummary");

let selectedToppings = [];
let selectedExtras = [];

// Handle input changes in form
form.addEventListener("change", (event) => {
  handleSelectionChange(event.target);
  updateTotalPrice();
});

function handleSelectionChange(target) {
  if (target.classList.contains("topping")) {
    selectedToppings = updateSelection(target, selectedToppings);
  }
  if (target.classList.contains("extra")) {
    selectedExtras = updateSelection(target, selectedExtras);
  }
}

function updateSelection(target, selectionArray) {
  return target.checked
    ? [...selectionArray, target]
    : selectionArray.filter((item) => item !== target);
}

function updateTotalPrice() {
  let total = 0;

  const selectedPancake = typeSelect.selectedOptions[0];
  total += Number(selectedPancake.dataset.price);

  total += selectedToppings.length;

  selectedExtras.forEach((extra) => {
    total += Number(extra.dataset.price);
  });

  const delivery = form.querySelector("input[name='delivery']:checked");
  if (delivery) {
    total += Number(delivery.dataset.price);
  }

  totalPriceDisplay.textContent = `${total}€`;
  totalPriceBanner.textContent = `${total}€`;
}

// Show order summary

seeOrderButton.addEventListener("click", () => {
  const name = customerName.value.trim();
  const pancake = typeSelect.selectedOptions[0].textContent;

  const toppingList = selectedToppings.map((t) =>
    t.parentElement.textContent.trim()
  );
  const extraList = selectedExtras.map((e) =>
    e.parentElement.textContent.trim()
  );

  const deliveryOption = form.querySelector("input[name='delivery']:checked");
  const delivery = deliveryOption
    ? deliveryOption.parentElement.textContent.trim()
    : "Not selected";

  const total = totalPriceDisplay.textContent;

  summaryText.innerHTML = [
    `Name: ${name}`,
    `Pancake: ${pancake}`,
    `Toppings: ${toppingList.length ? toppingList.join(", ") : "None"}`,
    `Extras: ${extraList.length ? extraList.join(", ") : "None"}`,
    `Delivery: ${delivery}`,
    `Total: ${total}`,
  ].join("<br>");

  orderSummary.style.display = "inline";
});

// confirm order

confirmOrderButton.addEventListener("click", (event) => {
  event.preventDefault();
  handleConfirmOrder();
});

function handleConfirmOrder() {
  const name = customerName.value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const deliveryOption = form.querySelector("input[name='delivery']:checked");
  if (!deliveryOption) {
    alert("Please select a delivery method.");
    return;
  }
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const order = {
    id: Date.now(),
    customerName: name,
    selectedPancake: typeSelect.selectedOptions[0].textContent
      .split(" - ")[0]
      .trim(),
    toppings: selectedToppings.map((t) => t.parentElement.textContent.trim()),
    extras: selectedExtras.map((e) =>
      e.parentElement.textContent.split(" - ")[0].trim()
    ),
    deliveryMethod: deliveryOption.parentElement.textContent.trim(),
    totalPrice: parseFloat(totalPriceDisplay.textContent.replace("€", "")),
    status: "waiting",
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order confirmed! Check your order at All Orders");
  window.open("allorders.html", "_blank");
}

document.getElementById("allOrdersButton").addEventListener("click", () => {
  window.open("allorders.html", "_blank");
});

resetFormState();

function resetFormState() {
  form.reset();
  selectedToppings = [];
  selectedExtras = [];
  updateTotalPrice();
}
