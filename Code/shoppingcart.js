$(() => {
  cart = getCartLocalStorage();
  dispayTheCartItems();
  updateTotalAmount();
  $(".total-amount button").click((e) => {
    makePayment();
  });
  updateMenuCart();
});

function updateMenuCart() {
  var local = getCartLocalStorage();
  totalItems = 0;
  for(var i=0; i<local.length; i++) {
    eachItem = JSON.parse(local[i]);
    totalItems += parseInt(eachItem.qty);
  }
  if(totalItems > 0) {
    $("#shoppingCartLink").html('<a href="./shoppingcart.html"><i class="fa fa-shopping-cart" aria-hidden="true"> ( ' + totalItems +' )</i></a>');
  } else {
    $("#shoppingCartLink").html('<a href="./shoppingcart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>');
  }
}

function itemAlreadyInCart(item) {
  var found = -1;
  local = getCartLocalStorage();
  for(var i=0; i<local.length; i++) {
    cartItem = JSON.parse(local[i]);
    if (cartItem.name == item.name) {
      found = i;
      break;
    }
  }
  return found;
}

function updateItemQuantity(item, index) {
  local = getCartLocalStorage();
  itemDataInCart = JSON.parse(local[index]);
  newQty = parseInt(itemDataInCart.qty) + parseInt(item.qty);
  itemDataInCart["qty"] = newQty;
  local[index] = JSON.stringify(itemDataInCart);
  setLocalStorage(local);
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function addToCart(item) {
  
  const button = document.querySelector(".addtocart");
  let added = false;
  const done = document.querySelector(".done");
    if(!added){
      done.style.transform = "translate(0px)";
      added = true;
    }
    await delay(1500);

  let local = getCartLocalStorage();
  itemIndexInCart = itemAlreadyInCart(item)
  if(itemIndexInCart != -1) {
    updateItemQuantity(item, itemIndexInCart);
    location.href = `shoppingcart.html`;
  } else {
    local.push(JSON.stringify(item));
    setLocalStorage(local);
    location.href = `shoppingcart.html`;
  }
}


function getCartLocalStorage() {
  return JSON.parse(window.localStorage.getItem("cart") ?? "[]");
}

function setLocalStorage(crt = []) {
  window.localStorage.setItem("cart", JSON.stringify(crt));
}


// Display the the cart itmes and the price
function dispayTheCartItems() {
  $(".cart-items").html("");
  if (cart.length === 0) {
    $(".cart-items").html("<h2>No Item In Cart</h2>");
  } else {
    // Loop through the cart and display items
    cart.forEach((e) => {
      eachProduct = JSON.parse(e);
      $(".cart-items").append(`
    <div class="cart-items-container">
    <div class="cart-item-img">
      <img src="./images/${eachProduct.name.split(' ').join('-')}.png" width="200px" height="200px" />
    </div>
    <div class="cart-action" >
      <div>
      <button id="reduce" onclick="decreaseQty('${eachProduct.name}')">
        -
        <!--<i class="fas fa-minus"></i>-->
      </button>
      <span id="prodQty">${eachProduct.qty}</span>
      <button id="add" onclick="increaseQty('${eachProduct.name}')">
        +  
      <!--<i class="fas fa-plus"></i>-->
      </button>
      <button id="remove" onclick="removeItem('${eachProduct.name}')">Delete</button>
      </div>
      
    </div>
    <div class="last_item">
      <b style='color:#000;'>${eachProduct.name}</b>
      <p>Price: <span>$${eachProduct.grossPrice}</span></p>
    </div>
  </div>
  `);
    });
  }
}
// Make Payment
function makePayment() {
  let finalCart = getCartLocalStorage();
  if (finalCart.length > 0) {
    emptyCart();
    alert("Thanks for the payment. You can shop more.");
    dispayTheCartItems();
  }
}

// remove item from cart
function removeItem(name) {
  for (let i = 0; i < cart.length; i++) {
    cartParsedItem = JSON.parse(cart[i]);
    if (cartParsedItem.name == name) {
      local = getCartLocalStorage();
      local.splice(i, 1);
      setLocalStorage(local);
      break;
    }
  }
  updateTotalAmount();
  dispayTheCartItems();
  updateMenuCart();
}

// Increasing the quantity of an item in the cart
function increaseQty(name) {
  for (let i = 0; i < cart.length; i++) {
    cartParsedItem = JSON.parse(cart[i]);
    if (cartParsedItem.name == name) {
      cartParsedItem.qty++;
      local = getCartLocalStorage();

      itemDataInCart = JSON.parse(local[i]);
      newQty = parseInt(itemDataInCart.qty) + 1;
      itemDataInCart["qty"] = newQty;
      local[i] = JSON.stringify(itemDataInCart);
      setLocalStorage(local);
      updateTotalAmount();
      dispayTheCartItems();
      updateMenuCart();
    }
  
  }
}
// Decreasing the quantity of an item in the cart
function decreaseQty(name) {
  for (let i = 0; i < cart.length; i++) {
    cartParsedItem = JSON.parse(cart[i]);
    if (cartParsedItem.name == name) {
      cartParsedItem.qty--;
      local = getCartLocalStorage();

      itemDataInCart = JSON.parse(local[i]);
      newQty = parseInt(itemDataInCart.qty) - 1;
      if(newQty > 0) {
        itemDataInCart["qty"] = newQty;
        local[i] = JSON.stringify(itemDataInCart);
        setLocalStorage(local);
        updateTotalAmount();
        dispayTheCartItems();
        updateMenuCart();
      } else if (newQty <= 0) {
        removeItem(name);
      }
    }
  
  }
}
// update the total amount
function updateTotalAmount() {
  totalAmount = 0;
  cart = getCartLocalStorage();
  for (let i = 0; i < cart.length; i++) {
    parsedCartItem = JSON.parse(cart[i]);
    totalAmount += parsedCartItem.qty * parsedCartItem.grossPrice;
  }
  var taxAmount = (totalAmount*0.13).toFixed(2);
  var payableAmount = parseFloat(totalAmount) + parseFloat(taxAmount);
  if(totalAmount > 0) {
    $("#totalAmount").html("<td>Total Price</td><td>$ " + totalAmount + "</td>");
    $("#taxAmount").html("<td>Tax (13%)</td><td>$ " + taxAmount + "</td>");
    $("#payableAmount").html("<td>Payable Amount</td><td>$ " + payableAmount.toFixed(2) + "</td>");
  } else {
    $(".total-amount").hide();
    $("#totalAmount").html("");
    $("#taxAmount").html("");
    $("#payableAmount").html("");
    $("#make-payment-btn").hide();
  }
}

// remove all items from cart
function emptyCart() {
  setLocalStorage([]);
  updateTotalAmount();
  updateMenuCart(); 
}