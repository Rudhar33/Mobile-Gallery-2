$(() => {
  var local = getCartLocalStorage();
  totalItems = 0;
  for(var i=0;i<local.length;i++) {
    eachItem = JSON.parse(local[i]);
    totalItems += parseInt(eachItem.qty);
  }
  if(totalItems > 0) {
    $("#shoppingCartLink").html('<a href="./shoppingcart.html"><i class="fa fa-shopping-cart" aria-hidden="true"> ( ' + totalItems +' )</i></a>');
  } else {
    $("#shoppingCartLink").html('<a href="./shoppingcart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>');
  }
});

function getCartLocalStorage() {
  return JSON.parse(window.localStorage.getItem("cart") ||  "[]");
}

function setLocalStorage(crt = []) {
  window.localStorage.setItem("cart", JSON.stringify(crt));
}

function itemAlreadyInCart(item) {
  var found = -1;
  local = getCartLocalStorage();
  for(var i=0; i<local.length;i++) {
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

function addToCart(item) {
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