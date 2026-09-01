/* =====================================================
   PRODUCT FILTER
===================================================== */

const tabs = document.querySelectorAll(".tab");
const products = document.querySelectorAll(".men-product");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        const filter = tab.dataset.filter;

        products.forEach(product => {

            const categories =
                product.dataset.category.split(" ");

            if (
                filter === "all" ||
                categories.includes(filter)
            ) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }

        });

    });

});


/* =====================================================
   SHOPPING BAG
===================================================== */

const bagBtn = document.getElementById("bagBtn");
const bagPanel = document.getElementById("bagPanel");
const bagOverlay = document.getElementById("bagOverlay");
const closeBag = document.getElementById("closeBag");

const bagItems = document.getElementById("bagItems");
const bagTotal = document.getElementById("bagTotal");
const bagCount = document.getElementById("bagCount");

let cart = [];


/* OPEN BAG */

bagBtn.addEventListener("click", function(event) {

    event.preventDefault();

    bagPanel.classList.add("open");
    bagOverlay.classList.add("open");

});


/* CLOSE BAG */

function closeBagPanel() {

    bagPanel.classList.remove("open");
    bagOverlay.classList.remove("open");

}

closeBag.addEventListener("click", closeBagPanel);

bagOverlay.addEventListener("click", closeBagPanel);


/* =====================================================
   ADD TO BAG
===================================================== */

document.querySelectorAll(".bag-btn").forEach(button => {

    button.addEventListener("click", function() {

        const product =
            this.closest(".men-product");

        const name =
            product.querySelector("h3").textContent;

        const priceText =
            product.querySelector(".men-product-info p").textContent;

        const price =
            parseInt(
                priceText
                    .replace("PKR", "")
                    .replace(",", "")
                    .trim()
            );


        cart.push({
            name: name,
            price: price
        });


        updateBag();


        /* Button feedback */

        this.innerHTML = "ADDED ✓";

        setTimeout(() => {

            this.innerHTML =
                'ADD TO BAG <i class="bi bi-bag"></i>';

        }, 1000);

    });

});


/* =====================================================
   UPDATE BAG
===================================================== */

function updateBag() {

    /* Update bag number */

    bagCount.textContent = cart.length;


    /* Empty bag */

    if (cart.length === 0) {

        bagItems.innerHTML =
            '<p class="empty-bag">Your bag is empty.</p>';

        bagTotal.textContent = "PKR 0";

        return;
    }


    /* Clear current items */

    bagItems.innerHTML = "";


    let total = 0;


    /* Add cart items */

    cart.forEach((item, index) => {

        total += item.price;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div>
                <strong>${item.name}</strong>

                <p>
                    PKR ${item.price.toLocaleString()}
                </p>
            </div>

            <button
                class="remove-item"
                onclick="removeItem(${index})"
            >
                <i class="bi bi-trash"></i>
            </button>

        `;


        bagItems.appendChild(cartItem);

    });


    /* Update total */

    bagTotal.textContent =
        "PKR " + total.toLocaleString();

}


/* =====================================================
   REMOVE ITEM
===================================================== */

function removeItem(index) {

    cart.splice(index, 1);

    updateBag();

}


/* Start with empty bag */

updateBag();

/* =====================================================
   WOMEN PRODUCT FILTER
===================================================== */
const womenTabs = document.querySelectorAll(".women-tab");
const womenProducts = document.querySelectorAll(".women-product");
womenTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    womenTabs.forEach(item => {
      item.classList.remove("active");
    });
    tab.classList.add("active");
    const filter = tab.dataset.filter;
    womenProducts.forEach(product => {
      const categories = product.dataset.category.split(" ");
      if (filter === "all" || categories.includes(filter)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});
/* =====================================================
   WOMEN ADD TO BAG
===================================================== */
document.querySelectorAll(".women-bag-btn").forEach(button => {
  button.addEventListener("click", function() {
    const product = this.closest(".women-product");
    const name = product.querySelector("h3").textContent;
    const priceText = product.querySelector(".women-product-info p").textContent;
    const price = parseInt(
      priceText
        .replace("PKR", "")
        .replace(",", "")
        .trim()
    );
    cart.push({
      name: name,
      price: price
    });
    updateBag();
    this.innerHTML = "ADDED ✓";
    setTimeout(() => {
      this.innerHTML = 'ADD TO BAG <i class="bi bi-bag"></i>';
    }, 1000);
  });
});

/* =====================================================
   KIDS PRODUCT FILTER
===================================================== */

const kidsTabs = document.querySelectorAll(".kids-tab");
const kidsProducts = document.querySelectorAll(".kids-product");

kidsTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    kidsTabs.forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    const filter = tab.dataset.filter;

    kidsProducts.forEach(product => {
      const categories = product.dataset.category.split(" ");

      if (
        filter === "all" ||
        categories.includes(filter)
      ) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});


/* =====================================================
   KIDS ADD TO BAG
===================================================== */

document.querySelectorAll(".kids-bag-btn").forEach(button => {
  button.addEventListener("click", function() {

    const product = this.closest(".kids-product");

    const name =
      product.querySelector("h3").textContent;

    const priceText =
      product.querySelector(".kids-product-info p").textContent;

    const price = parseInt(
      priceText
        .replace("PKR", "")
        .replace(",", "")
        .trim()
    );

    cart.push({
      name: name,
      price: price
    });

    updateBag();

    this.innerHTML = "ADDED ✓";

    setTimeout(() => {
      this.innerHTML =
        'ADD TO BAG <i class="bi bi-bag"></i>';
    }, 1000);
  });
});

/* =====================================================
   ACCESSORIES PRODUCT FILTER
===================================================== */

const accessoriesTabs =
  document.querySelectorAll(".accessories-tab");

const accessoriesProducts =
  document.querySelectorAll(".accessories-product");

accessoriesTabs.forEach(tab => {
  tab.addEventListener("click", () => {

    accessoriesTabs.forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    const filter = tab.dataset.filter;

    accessoriesProducts.forEach(product => {
      const categories =
        product.dataset.category.split(" ");

      if (
        filter === "all" ||
        categories.includes(filter)
      ) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
});


/* =====================================================
   ACCESSORIES ADD TO BAG
===================================================== */

document.querySelectorAll(".accessories-bag-btn")
  .forEach(button => {

    button.addEventListener("click", function() {

      const product =
        this.closest(".accessories-product");

      const name =
        product.querySelector("h3").textContent;

      const priceText =
        product.querySelector(
          ".accessories-product-info p"
        ).textContent;

      const price = parseInt(
        priceText
          .replace("PKR", "")
          .replace(",", "")
          .trim()
      );

      cart.push({
        name: name,
        price: price
      });

      updateBag();

      this.innerHTML = "ADDED ✓";

      setTimeout(() => {
        this.innerHTML =
          'ADD TO BAG <i class="bi bi-bag"></i>';
      }, 1000);
    });
  });
  const contactBtn = document.getElementById("contactBtn");
const contactPanel = document.getElementById("contactPanel");
const contactClose = document.getElementById("contactClose");

contactBtn.addEventListener("click", function() {
  contactPanel.classList.add("open");
});

contactClose.addEventListener("click", function() {
  contactPanel.classList.remove("open");
});
const mobileBagBtn = document.getElementById("mobileBagBtn");

if (mobileBagBtn) {
  mobileBagBtn.addEventListener("click", function() {
    bagPanel.classList.add("open");
    bagOverlay.classList.add("open");
  });
}