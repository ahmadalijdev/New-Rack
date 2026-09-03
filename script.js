/* =====================================================
   OPEN RACK — SCRIPT
===================================================== */

"use strict";


/* =====================================================
   PRODUCT DATA
===================================================== */

const products = [
  /* =========================
     MEN
  ========================= */

  {
    id: "men-item-1",
    name: "Shirt",
    section: "men",
    category: "T-SHIRTS",
    filters: ["tshirt", "new"],
    price: 2490,
    color: "Black",
    sizes: ["standard"],
    description:
      "A relaxed oversized silhouette designed for everyday wear.",
    images: [
      "images/men-item-1a.png",
      "images/men-item-1b.png",
      "images/men-item-1c.png"
    ]
  },
  {
    id: "men-item-1",
    name: "Oversized T-Shirt",
    section: "women",
    category: "T-SHIRTS",
    filters: ["tshirt", "new"],
    price: 2490,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    description:
      "A relaxed oversized silhouette designed for everyday wear.",
    images: [
      "images/men-item-1a.png",
      "images/men-item-1b.png",
      "images/men-item-1c.png"
    ]
  },
  {
    id: "men-item-1",
    name: "Oversized T-Shirt",
    section: "kids",
    category: "T-SHIRTS",
    filters: ["tshirt", "new"],
    price: 2490,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    description:
      "A relaxed oversized silhouette designed for everyday wear.",
    images: [
      "images/men-item-1a.png",
      "images/men-item-1b.png",
      "images/men-item-1c.png"
    ]
  },
  {
    id: "men-item-1",
    name: "Oversized T-Shirt",
    section: "accessories",
    category: "T-SHIRTS",
    filters: ["tshirt", "new"],
    price: 2490,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    description:
      "A relaxed oversized silhouette designed for everyday wear.",
    images: [
      "images/men-item-1a.png",
      "images/men-item-1b.png",
      "images/men-item-1c.png"
    ]
  },
];


/* =====================================================
   CONSTANTS
===================================================== */

const CART_STORAGE_KEY =
  "open-rack-cart";

const WHATSAPP_NUMBER =
  "923249481393";

const EMAIL_ADDRESS =
  "ahmadalij.dev@gmail.com";


/* =====================================================
   STATE
===================================================== */

let cart = loadCart();

let currentProduct = null;

let currentProductImage = 0;

let selectedSize = "";

let productSlideIntervals = [];

let searchDebounceTimer = null;

let touchStartX = 0;

let touchEndX = 0;


/* =====================================================
   DOM REFERENCES
===================================================== */

const productGrids = {
  men:
    document.querySelector(
      ".men-product-grid"
    ),

  women:
    document.querySelector(
      ".women-product-grid"
    ),

  kids:
    document.querySelector(
      ".kids-product-grid"
    ),

  accessories:
    document.querySelector(
      ".accessories-product-grid"
    )
};


const productModalOverlay =
  document.getElementById(
    "productModalOverlay"
  );

const productModal =
  document.getElementById(
    "productModal"
  );

const productModalClose =
  document.getElementById(
    "productModalClose"
  );

const productModalImages =
  document.getElementById(
    "productModalImages"
  );

const productModalPrev =
  document.getElementById(
    "productModalPrev"
  );

const productModalNext =
  document.getElementById(
    "productModalNext"
  );

const productModalDots =
  document.getElementById(
    "productModalDots"
  );

const productModalCategory =
  document.getElementById(
    "productModalCategory"
  );

const productModalName =
  document.getElementById(
    "productModalName"
  );

const productModalPrice =
  document.getElementById(
    "productModalPrice"
  );

const productModalDescription =
  document.getElementById(
    "productModalDescription"
  );

const productModalColor =
  document.getElementById(
    "productModalColor"
  );

const productModalSizes =
  document.getElementById(
    "productModalSizes"
  );

const productModalSelectedSize =
  document.getElementById(
    "productModalSelectedSize"
  );

const productOrderBtn =
  document.getElementById(
    "productOrderBtn"
  );


const bagOverlay =
  document.getElementById(
    "bagOverlay"
  );

const bagPanel =
  document.getElementById(
    "bagPanel"
  );

const closeBag =
  document.getElementById(
    "closeBag"
  );

const bagItems =
  document.getElementById(
    "bagItems"
  );

const bagTotal =
  document.getElementById(
    "bagTotal"
  );

const checkoutBtn =
  document.getElementById(
    "checkoutBtn"
  );


const searchBtn =
  document.getElementById(
    "searchBtn"
  );

const mobileSearchBtn =
  document.getElementById(
    "mobileSearchBtn"
  );

const searchPanel =
  document.getElementById(
    "searchPanel"
  );

const searchClose =
  document.getElementById(
    "searchClose"
  );

const searchInput =
  document.getElementById(
    "searchInput"
  );

const searchClear =
  document.getElementById(
    "searchClear"
  );

const searchResults =
  document.getElementById(
    "searchResults"
  );


const contactBtn =
  document.querySelector(
    ".contact-btn"
  );

const contactPanel =
  document.getElementById(
    "contactPanel"
  );

const contactClose =
  document.querySelector(
    ".contact-close"
  );


/* =====================================================
   GENERIC HELPERS
===================================================== */

function formatPrice(price) {
  return `PKR ${Number(
    price
  ).toLocaleString("en-PK")}`;
}


function getProductById(
  productId
) {
  return (
    products.find(
      product =>
        product.id === productId
    ) || null
  );
}


function getProductImage(
  product
) {
  return (
    Array.isArray(product?.images) &&
    product.images.length
  )
    ? product.images[0]
    : "";
}


function getProductSizes(
  product
) {
  return Array.isArray(
    product?.sizes
  )
    ? product.sizes
    : [];
}


function getProductColor(
  product
) {
  return product?.color || "—";
}


function getProductDescription(
  product
) {
  return (
    product?.description ||
    "A contemporary piece designed for everyday wear."
  );
}


function isStandardProduct(
  product
) {
  const sizes =
    getProductSizes(product);

  return (
    sizes.length === 0 ||
    (
      sizes.length === 1 &&
      String(
        sizes[0]
      ).toUpperCase() ===
        "STANDARD"
    )
  );
}


function hasProductSizes(
  product
) {
  return !isStandardProduct(
    product
  );
}


function normalizeText(
  value
) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();
}


function findClosest(
  target,
  selectors
) {
  if (!target) {
    return null;
  }

  return target.closest(
    selectors
  );
}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function loadCart() {
  try {
    const saved =
      localStorage.getItem(
        CART_STORAGE_KEY
      );

    if (!saved) {
      return [];
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(item => {
        return (
          item &&
          typeof item.productId ===
            "string" &&
          Number(item.quantity) > 0 &&
          getProductById(
            item.productId
          )
        );
      })
      .map(item => ({
        productId:
          item.productId,

        size:
          item.size ||
          "STANDARD",

        quantity:
          Math.max(
            1,
            Math.floor(
              Number(
                item.quantity
              )
            )
          )
      }));
  } catch (error) {
    console.warn(
      "OPEN RACK: Could not load cart.",
      error
    );

    return [];
  }
}


function saveCart() {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.warn(
      "OPEN RACK: Could not save cart.",
      error
    );
  }
}


/* =====================================================
   BODY SCROLL LOCK
===================================================== */

function updateBodyLock() {
  const shouldLock =
    document.body.classList.contains(
      "product-modal-open"
    ) ||
    document.body.classList.contains(
      "bag-open"
    ) ||
    document.body.classList.contains(
      "search-open"
    ) ||
    document.body.classList.contains(
      "checkout-open"
    ) ||
    document.body.classList.contains(
      "contact-open"
    );

  document.body.style.overflow =
    shouldLock ? "hidden" : "";
}


/* =====================================================
   PRODUCT CARD CREATION
===================================================== */

function createProductCard(
  product
) {
  const article =
    document.createElement(
      "article"
    );

  article.className =
    `${product.section}-product`;

  article.dataset.productId =
    product.id;

  article.dataset.category =
    product.category;

  article.dataset.price =
    product.price;


  const imageWrapper =
    document.createElement(
      "div"
    );

  imageWrapper.className =
    `${product.section}-product-image`;


  const images =
    Array.isArray(
      product.images
    )
      ? product.images
      : [];


  images.forEach(
    (image, index) => {

      const img =
        document.createElement(
          "img"
        );

      img.className =
        "product-slide";

      if (index === 0) {
        img.classList.add(
          "active"
        );
      }

      img.src = image;

      img.alt =
        `${product.name} - view ${
          index + 1
        }`;

      img.loading = "lazy";

      img.addEventListener(
        "error",
        () => {
          img.style.display =
            "none";
        }
      );

      imageWrapper.appendChild(
        img
      );
    }
  );


  const info =
    document.createElement(
      "div"
    );

  info.className =
    `${product.section}-product-info`;


  const textWrapper =
    document.createElement(
      "div"
    );


  const name =
    document.createElement(
      "h3"
    );

  name.textContent =
    product.name;


  const category =
    document.createElement(
      "span"
    );

  category.textContent =
    product.category;


  const price =
    document.createElement(
      "p"
    );

  price.textContent =
    formatPrice(
      product.price
    );


  textWrapper.appendChild(
    name
  );

  textWrapper.appendChild(
    category
  );

  textWrapper.appendChild(
    price
  );


  const bagButton =
    document.createElement(
      "button"
    );

  bagButton.type =
    "button";

  bagButton.className =
    "bag-btn";

  bagButton.textContent =
    "ADD TO BAG";

  bagButton.dataset.productId =
    product.id;


  info.appendChild(
    textWrapper
  );

  info.appendChild(
    bagButton
  );


  article.appendChild(
    imageWrapper
  );

  article.appendChild(
    info
  );


  return article;
}


/* =====================================================
   PRODUCT RENDERING
===================================================== */

function renderProducts(
  section,
  filter = "all"
) {
  const grid =
    productGrids[section];

  if (!grid) {
    return;
  }


  const normalizedFilter =
    normalizeText(filter);


  const sectionProducts =
    products.filter(
      product =>
        normalizeText(
          product.section
        ) ===
        normalizeText(section)
    );


  const filteredProducts =
    normalizedFilter ===
      "all"
      ? sectionProducts
      : sectionProducts.filter(
          product =>
            Array.isArray(
              product.filters
            ) &&
            product.filters.some(
              productFilter =>
                normalizeText(
                  productFilter
                ) ===
                normalizedFilter
            )
        );


  /*
   * Remove everything currently
   * inside this grid.
   */
  grid.innerHTML = "";


  /*
   * No matching products means
   * an empty grid.
   */
  if (!filteredProducts.length) {
    return;
  }


  const fragment =
    document.createDocumentFragment();


  filteredProducts.forEach(
    product => {

      fragment.appendChild(
        createProductCard(
          product
        )
      );
    }
  );


  grid.appendChild(
    fragment
  );


  restartProductSlideshows();
}


function renderAllProducts() {
  renderProducts(
    "men",
    "all"
  );

  renderProducts(
    "women",
    "all"
  );

  renderProducts(
    "kids",
    "all"
  );

  renderProducts(
    "accessories",
    "all"
  );
}


/* =====================================================
   PRODUCT SLIDESHOW
===================================================== */

function stopProductSlideshows() {
  productSlideIntervals.forEach(
    interval => {
      clearInterval(
        interval
      );
    }
  );

  productSlideIntervals = [];
}


function restartProductSlideshows() {
  stopProductSlideshows();


  document
    .querySelectorAll(
      ".men-product, " +
      ".women-product, " +
      ".kids-product, " +
      ".accessories-product"
    )
    .forEach(card => {

      const slides =
        card.querySelectorAll(
          ".product-slide"
        );


      if (slides.length <= 1) {
        return;
      }


      let currentSlide = 0;


      const interval =
        window.setInterval(
          () => {

            slides[
              currentSlide
            ]?.classList.remove(
              "active"
            );


            currentSlide =
              (
                currentSlide + 1
              ) %
              slides.length;


            slides[
              currentSlide
            ]?.classList.add(
              "active"
            );

          },
          4000
        );


      productSlideIntervals.push(
        interval
      );
    });
}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function openProductModal(
  productId
) {
  const product =
    getProductById(
      productId
    );

  if (!product) {
    return;
  }


  closeSearch();

  closeBagPanel();

  closeContactPanel();


  currentProduct =
    product;

  currentProductImage = 0;

  selectedSize = "";


  if (productModalCategory) {
    productModalCategory.textContent =
      product.category;
  }


  if (productModalName) {
    productModalName.textContent =
      product.name;
  }


  if (productModalPrice) {
    productModalPrice.textContent =
      formatPrice(
        product.price
      );
  }


  if (productModalDescription) {
    productModalDescription.textContent =
      getProductDescription(
        product
      );
  }


  if (productModalColor) {
    productModalColor.textContent =
      getProductColor(
        product
      );
  }


  renderModalImages(
    product
  );

  renderModalSizes(
    product
  );


  productModalOverlay?.classList.add(
    "open"
  );

  productModal?.classList.add(
    "open"
  );


  document.body.classList.add(
    "product-modal-open"
  );


  updateBodyLock();


  window.setTimeout(
    () => {
      productModalClose?.focus();
    },
    100
  );
}


function closeProductModal() {
  productModalOverlay?.classList.remove(
    "open"
  );

  productModal?.classList.remove(
    "open"
  );

  document.body.classList.remove(
    "product-modal-open"
  );


  currentProduct =
    null;

  currentProductImage =
    0;

  selectedSize =
    "";


  updateBodyLock();
}


/* =====================================================
   MODAL IMAGES
===================================================== */

function renderModalImages(
  product
) {
  if (
    !productModalImages ||
    !productModalDots
  ) {
    return;
  }


  productModalImages.innerHTML =
    "";

  productModalDots.innerHTML =
    "";


  const images =
    Array.isArray(
      product.images
    )
      ? product.images
      : [];


  images.forEach(
    (image, index) => {

      const img =
        document.createElement(
          "img"
        );


      img.className =
        "product-modal-image";


      if (index === 0) {
        img.classList.add(
          "active"
        );
      }


      img.src =
        image;


      img.alt =
        `${product.name} - view ${
          index + 1
        }`;


      img.addEventListener(
        "error",
        () => {
          img.style.display =
            "none";
        }
      );


      productModalImages.appendChild(
        img
      );


      const dot =
        document.createElement(
          "button"
        );


      dot.type =
        "button";


      dot.className =
        "product-modal-dot";


      if (index === 0) {
        dot.classList.add(
          "active"
        );
      }


      dot.setAttribute(
        "aria-label",
        `View image ${index + 1}`
      );


      dot.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          showModalImage(
            index
          );
        }
      );


      productModalDots.appendChild(
        dot
      );
    }
  );


  updateModalImageControls(
    images.length
  );
}


function showModalImage(
  index
) {
  const images =
    productModalImages?.querySelectorAll(
      ".product-modal-image"
    );


  const dots =
    productModalDots?.querySelectorAll(
      ".product-modal-dot"
    );


  if (!images?.length) {
    return;
  }


  currentProductImage =
    (
      index + images.length
    ) %
    images.length;


  images.forEach(
    (image, imageIndex) => {

      image.classList.toggle(
        "active",
        imageIndex ===
          currentProductImage
      );
    }
  );


  dots?.forEach(
    (dot, dotIndex) => {

      dot.classList.toggle(
        "active",
        dotIndex ===
          currentProductImage
      );
    }
  );
}


function updateModalImageControls(
  count
) {
  const show =
    count > 1;


  if (productModalPrev) {
    productModalPrev.style.display =
      show ? "" : "none";
  }


  if (productModalNext) {
    productModalNext.style.display =
      show ? "" : "none";
  }


  if (productModalDots) {
    productModalDots.style.display =
      show ? "" : "none";
  }
}


/* =====================================================
   MODAL SIZES
===================================================== */

function renderModalSizes(
  product
) {
  if (!productModalSizes) {
    return;
  }


  productModalSizes.innerHTML =
    "";


  if (productModalSelectedSize) {

    productModalSelectedSize.textContent =
      "";

    productModalSelectedSize.style.color =
      "";
  }


  if (
    isStandardProduct(
      product
    )
  ) {

    productModalSizes.style.display =
      "none";


    selectedSize =
      "STANDARD";


    if (productModalSelectedSize) {
      productModalSelectedSize.textContent =
        "STANDARD";
    }


    return;
  }


  productModalSizes.style.display =
    "flex";


  getProductSizes(
    product
  ).forEach(
    size => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "product-size";


      button.textContent =
        size;


      button.dataset.size =
        size;


      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          selectedSize =
            size;


          productModalSizes
            .querySelectorAll(
              ".product-size"
            )
            .forEach(
              sizeButton => {

                sizeButton.classList.toggle(
                  "active",
                  sizeButton.dataset.size ===
                    size
                );
              }
            );


          if (
            productModalSelectedSize
          ) {

            productModalSelectedSize.textContent =
              size;

            productModalSelectedSize.style.color =
              "";
          }
        }
      );


      productModalSizes.appendChild(
        button
      );
    }
  );
}


/* =====================================================
   CART
===================================================== */

function addToCart(
  productId,
  size = ""
) {
  const product =
    getProductById(
      productId
    );


  if (!product) {
    return false;
  }


  const finalSize =
    isStandardProduct(
      product
    )
      ? "STANDARD"
      : String(size).trim();


  if (
    !isStandardProduct(
      product
    ) &&
    !finalSize
  ) {
    return false;
  }


  const existingItem =
    cart.find(
      item =>
        item.productId ===
          productId &&
        item.size ===
          finalSize
    );


  if (existingItem) {

    existingItem.quantity +=
      1;

  } else {

    cart.push({
      productId:
        productId,

      size:
        finalSize,

      quantity:
        1
    });
  }


  saveCart();

  updateBag();


  return true;
}


function increaseCartQuantity(
  productId,
  size
) {
  const item =
    cart.find(
      cartItem =>
        cartItem.productId ===
          productId &&
        cartItem.size ===
          size
    );


  if (!item) {
    return;
  }


  item.quantity +=
    1;


  saveCart();

  updateBag();
}


function decreaseCartQuantity(
  productId,
  size
) {
  const item =
    cart.find(
      cartItem =>
        cartItem.productId ===
          productId &&
        cartItem.size ===
          size
    );


  if (!item) {
    return;
  }


  if (
    item.quantity <= 1
  ) {

    removeFromCart(
      productId,
      size
    );

    return;
  }


  item.quantity -=
    1;


  saveCart();

  updateBag();
}


function removeFromCart(
  productId,
  size
) {
  cart =
    cart.filter(
      item =>
        !(
          item.productId ===
            productId &&
          item.size ===
            size
        )
    );


  saveCart();

  updateBag();
}


function getCartTotal() {
  return cart.reduce(
    (
      total,
      item
    ) => {

      const product =
        getProductById(
          item.productId
        );


      if (!product) {
        return total;
      }


      return (
        total +
        product.price *
          item.quantity
      );
    },
    0
  );
}


function getCartCount() {
  return cart.reduce(
    (
      count,
      item
    ) =>
      count +
      Number(
        item.quantity || 0
      ),
    0
  );
}


/* =====================================================
   BAG
===================================================== */

function updateBag() {
  if (!bagItems) {
    updateBagCounts();
    return;
  }


  /*
   * Remove invalid cart items.
   */
  const validCart =
    cart.filter(
      item =>
        getProductById(
          item.productId
        )
    );


  if (
    validCart.length !==
    cart.length
  ) {

    cart =
      validCart;

    saveCart();
  }


  bagItems.innerHTML =
    "";


  if (!cart.length) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "empty-bag";


    empty.textContent =
      "Your bag is currently empty.";


    bagItems.appendChild(
      empty
    );

  } else {

    const fragment =
      document.createDocumentFragment();


    cart.forEach(
      item => {

        const product =
          getProductById(
            item.productId
          );


        if (!product) {
          return;
        }


        fragment.appendChild(
          createCartItem(
            product,
            item
          )
        );
      }
    );


    bagItems.appendChild(
      fragment
    );
  }


  if (bagTotal) {

    bagTotal.textContent =
      formatPrice(
        getCartTotal()
      );
  }


  updateBagCounts();
}


function createCartItem(
  product,
  item
) {
  const cartItem =
    document.createElement(
      "div"
    );


  cartItem.className =
    "cart-item";


  cartItem.dataset.productId =
    product.id;


  cartItem.dataset.size =
    item.size;


  const info =
    document.createElement(
      "div"
    );


  const name =
    document.createElement(
      "strong"
    );


  name.textContent =
    product.name;


  const details =
    document.createElement(
      "p"
    );


  details.textContent =
    `${formatPrice(
      product.price
    )} × ${
      item.quantity
    }` +
    (
      item.size &&
      item.size !==
        "STANDARD"
        ? ` • Size ${item.size}`
        : ""
    );


  const controls =
    document.createElement(
      "div"
    );


  controls.className =
    "cart-item-controls";


  const decrease =
    document.createElement(
      "button"
    );


  decrease.type =
    "button";


  decrease.className =
    "quantity-btn";


  decrease.textContent =
    "−";


  decrease.setAttribute(
    "aria-label",
    `Decrease quantity of ${product.name}`
  );


  decrease.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      decreaseCartQuantity(
        product.id,
        item.size
      );
    }
  );


  const quantity =
    document.createElement(
      "span"
    );


  quantity.className =
    "cart-quantity";


  quantity.textContent =
    item.quantity;


  const increase =
    document.createElement(
      "button"
    );


  increase.type =
    "button";


  increase.className =
    "quantity-btn";


  increase.textContent =
    "+";


  increase.setAttribute(
    "aria-label",
    `Increase quantity of ${product.name}`
  );


  increase.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      increaseCartQuantity(
        product.id,
        item.size
      );
    }
  );


  controls.appendChild(
    decrease
  );

  controls.appendChild(
    quantity
  );

  controls.appendChild(
    increase
  );


  info.appendChild(
    name
  );

  info.appendChild(
    details
  );

  info.appendChild(
    controls
  );


  const removeButton =
    document.createElement(
      "button"
    );


  removeButton.type =
    "button";


  removeButton.className =
    "remove-item";


  removeButton.innerHTML =
    '<i class="fa-solid fa-trash"></i>';


  removeButton.setAttribute(
    "aria-label",
    `Remove ${product.name} from bag`
  );


  removeButton.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      removeFromCart(
        product.id,
        item.size
      );
    }
  );


  cartItem.appendChild(
    info
  );

  cartItem.appendChild(
    removeButton
  );


  return cartItem;
}


function updateBagCounts() {
  const count =
    getCartCount();


  document
    .querySelectorAll(
      ".bag-count, .mobile-bag-count"
    )
    .forEach(
      element => {

        element.textContent =
          count;


        element.style.display =
          count > 0
            ? "flex"
            : "none";
      }
    );
}


/* =====================================================
   BAG OPEN / CLOSE
===================================================== */

function openBag() {
  closeSearch();

  closeContactPanel();

  closeProductModal();


  bagOverlay?.classList.add(
    "open"
  );


  bagPanel?.classList.add(
    "open"
  );


  document.body.classList.add(
    "bag-open"
  );


  updateBag();

  updateBodyLock();
}


function closeBagPanel() {
  bagOverlay?.classList.remove(
    "open"
  );


  bagPanel?.classList.remove(
    "open"
  );


  document.body.classList.remove(
    "bag-open"
  );


  updateBodyLock();
}


function toggleBag() {
  if (
    bagPanel?.classList.contains(
      "open"
    )
  ) {

    closeBagPanel();

  } else {

    openBag();
  }
}


/* =====================================================
   ROBUST BAG BUTTON HANDLER
===================================================== */

function setupGlobalBagClickHandler() {
  document.addEventListener(
    "click",
    event => {

      const bagControl =
        findClosest(
          event.target,
          [
            ".bag-toggle",
            "[data-open-bag]",
            "#mobileBagBtn",
            "#openBag",
            "#bagButton",
            ".bag-button",
            ".cart-button",
            ".cart-toggle",
            '[aria-label*="bag" i]',
            '[aria-label*="cart" i]'
          ].join(", ")
        );


      if (!bagControl) {
        return;
      }


      /*
       * Ignore product-card buttons.
       */
      if (
        bagControl.classList.contains(
          "bag-btn"
        )
      ) {
        return;
      }


      event.preventDefault();

      event.stopPropagation();

      event.stopImmediatePropagation();


      toggleBag();

    },
    true
  );
}


/* =====================================================
   CHECKOUT DIALOG STYLES
===================================================== */

function injectCheckoutStyles() {
  if (
    document.getElementById(
      "openRackCheckoutStyles"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "openRackCheckoutStyles";


  style.textContent = `
    #openRackCheckoutDialog {
      position: fixed;
      inset: 0;

      width: min(
        620px,
        calc(100vw - 32px)
      );

      max-width: calc(
        100vw - 32px
      );

      height: auto;

      max-height: calc(
        100dvh - 32px
      );

      margin: auto;

      padding: 0;

      border: 1px solid #D9DEE8;

      border-radius: 14px;

      background: #FFFFFF;

      color: #0B1220;

      overflow: hidden;

      box-shadow:
        0 24px 80px
        rgba(11, 18, 32, .24);

      transform: translateY(0);

      animation:
        openRackCheckoutIn
        .22s ease-out;
    }


    #openRackCheckoutDialog::backdrop {
      background:
        rgba(11, 18, 32, .60);

      backdrop-filter:
        blur(7px);
    }


    @keyframes openRackCheckoutIn {
      from {
        opacity: 0;
        transform:
          translateY(10px)
          scale(.98);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }


    .open-rack-checkout {
      display: flex;
      flex-direction: column;

      width: 100%;

      max-height:
        calc(100dvh - 32px);
    }


    .open-rack-checkout-header {
      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 18px;

      padding:
        20px 24px;

      border-bottom:
        1px solid #D9DEE8;
    }


    .open-rack-checkout-header h2 {
      margin: 0;

      font-size: 21px;

      font-weight: 600;

      letter-spacing:
        -.02em;
    }


    .open-rack-checkout-close {
      display: grid;

      place-items: center;

      flex: 0 0 auto;

      width: 36px;

      height: 36px;

      padding: 0;

      border:
        1px solid #D9DEE8;

      border-radius: 50%;

      background:
        #FFFFFF;

      color:
        #0B1220;

      font-size: 22px;

      line-height: 1;

      cursor: pointer;

      transition:
        .2s ease;
    }


    .open-rack-checkout-close:hover {
      border-color:
        #0B1220;

      background:
        #F8F9FC;
    }


    .open-rack-checkout-body {
      overflow-y: auto;

      padding:
        24px;

      scrollbar-width:
        thin;
    }


    .open-rack-checkout-section {
      margin-bottom:
        26px;
    }


    .open-rack-checkout-section:last-child {
      margin-bottom: 0;
    }


    .open-rack-checkout-section h3 {
      margin:
        0 0 12px;

      font-size:
        12px;

      font-weight:
        700;

      letter-spacing:
        .12em;

      text-transform:
        uppercase;
    }


    .open-rack-payment-options {
      display:
        grid;

      gap:
        9px;
    }


    .open-rack-payment-option {
      display:
        flex;

      align-items:
        center;

      gap:
        12px;

      min-height:
        52px;

      padding:
        12px 14px;

      border:
        1px solid #D9DEE8;

      border-radius:
        8px;

      background:
        #FFFFFF;

      cursor:
        pointer;

      transition:
        border-color .2s ease,
        background .2s ease;
    }


    .open-rack-payment-option:hover {
      border-color:
        #1746A2;

      background:
        #F8F9FC;
    }


    .open-rack-payment-option:has(input:checked) {
      border-color:
        #1746A2;

      background:
        #F2F5FC;
    }


    .open-rack-payment-option input {
      width:
        16px;

      height:
        16px;

      margin:
        0;

      accent-color:
        #1746A2;
    }


    .open-rack-payment-option span {
      font-size:
        14px;

      font-weight:
        500;
    }


    .open-rack-address-grid {
      display:
        grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap:
        14px;
    }


    .open-rack-field {
      display:
        flex;

      flex-direction:
        column;

      gap:
        7px;
    }


    .open-rack-field.full {
      grid-column:
        1 / -1;
    }


    .open-rack-field label {
      font-size:
        12px;

      font-weight:
        600;
    }


    .open-rack-field input {
      width:
        100%;

      height:
        45px;

      padding:
        0 12px;

      border:
        1px solid #D9DEE8;

      border-radius:
        7px;

      background:
        #FFFFFF;

      color:
        #0B1220;

      font:
        inherit;

      font-size:
        14px;

      outline:
        none;

      transition:
        border-color .2s ease,
        box-shadow .2s ease;
    }


    .open-rack-field input::placeholder {
      color:
        #697180;
    }


    .open-rack-field input:focus {
      border-color:
        #1746A2;

      box-shadow:
        0 0 0 3px
        rgba(23,70,162,.10);
    }


    .open-rack-checkout-error {
      display:
        none;

      margin-top:
        12px;

      padding:
        10px 12px;

      border:
        1px solid #efcccc;

      border-radius:
        7px;

      background:
        #fff5f5;

      color:
        #a40000;

      font-size:
        13px;

      line-height:
        1.45;
    }


    .open-rack-checkout-footer {
      display:
        flex;

      align-items:
        center;

      justify-content:
        flex-end;

      gap:
        10px;

      padding:
        16px 24px;

      border-top:
        1px solid #D9DEE8;

      background:
        #FFFFFF;
    }


    .open-rack-checkout-footer button {
      min-height:
        44px;

      padding:
        0 18px;

      border-radius:
        7px;

      font:
        inherit;

      font-size:
        12px;

      font-weight:
        600;

      letter-spacing:
        .05em;

      cursor:
        pointer;

      transition:
        transform .2s ease,
        opacity .2s ease;
    }


    .open-rack-checkout-footer button:hover {
      transform:
        translateY(-1px);
    }


    .open-rack-checkout-cancel {
      border:
        1px solid #D9DEE8;

      background:
        #FFFFFF;

      color:
        #0B1220;
    }


    .open-rack-checkout-submit {
      border:
        1px solid #0B1220;

      background:
        #0B1220;

      color:
        #FFFFFF;
    }


    @media (max-width: 600px) {

      #openRackCheckoutDialog {
        width:
          calc(100vw - 20px);

        max-width:
          calc(100vw - 20px);

        max-height:
          calc(100dvh - 20px);

        border-radius:
          12px;
      }


      .open-rack-checkout {
        max-height:
          calc(100dvh - 20px);
      }


      .open-rack-checkout-header {
        padding:
          17px 18px;
      }


      .open-rack-checkout-header h2 {
        font-size:
          18px;
      }


      .open-rack-checkout-body {
        padding:
          20px 18px;
      }


      .open-rack-address-grid {
        grid-template-columns:
          1fr;

        gap:
          12px;
      }


      .open-rack-field.full {
        grid-column:
          auto;
      }


      .open-rack-checkout-footer {
        flex-direction:
          column-reverse;

        padding:
          14px 18px;
      }


      .open-rack-checkout-footer button {
        width:
          100%;
      }
    }
  `;


  document.head.appendChild(
    style
  );
}


/* =====================================================
   CREATE CHECKOUT DIALOG
===================================================== */

function createCheckoutDialog() {
  let dialog =
    document.getElementById(
      "openRackCheckoutDialog"
    );


  if (dialog) {
    return dialog;
  }


  injectCheckoutStyles();


  dialog =
    document.createElement(
      "dialog"
    );


  dialog.id =
    "openRackCheckoutDialog";


  dialog.innerHTML = `
    <div class="open-rack-checkout">

      <div class="open-rack-checkout-header">

        <h2>Complete Your Order</h2>

        <button
          type="button"
          class="open-rack-checkout-close"
          id="openRackCheckoutClose"
          aria-label="Close checkout"
        >
          ×
        </button>

      </div>


      <form
        class="open-rack-checkout-body"
        id="openRackCheckoutForm"
      >

        <div
          class="open-rack-checkout-section"
        >

          <h3>
            Payment Method
          </h3>


          <div
            class="open-rack-payment-options"
          >

            <label
              class="open-rack-payment-option"
            >

              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                required
              >

              <span>
                Cash on Delivery
              </span>

            </label>


            <label
              class="open-rack-payment-option"
            >

              <input
                type="radio"
                name="paymentMethod"
                value="Bank Transfer"
              >

              <span>
                Bank Transfer
              </span>

            </label>


            <label
              class="open-rack-payment-option"
            >

              <input
                type="radio"
                name="paymentMethod"
                value="EasyPaisa"
              >

              <span>
                Other Wallet — EasyPaisa
              </span>

            </label>

          </div>

        </div>


        <div
          class="open-rack-checkout-section"
        >

          <h3>
            Delivery Location
          </h3>


          <div
            class="open-rack-address-grid"
          >

            <div class="open-rack-field">

              <label
                for="checkoutCountry"
              >
                Country
              </label>

              <input
                id="checkoutCountry"
                name="country"
                type="text"
                value="Pakistan"
                autocomplete="country-name"
                required
              >

            </div>


            <div class="open-rack-field">

              <label
                for="checkoutCity"
              >
                City
              </label>

              <input
                id="checkoutCity"
                name="city"
                type="text"
                placeholder="e.g. Lahore"
                autocomplete="address-level2"
                required
              >

            </div>


            <div class="open-rack-field">

              <label
                for="checkoutArea"
              >
                Area
              </label>

              <input
                id="checkoutArea"
                name="area"
                type="text"
                placeholder="e.g. DHA Phase 5"
                autocomplete="address-level3"
                required
              >

            </div>


            <div class="open-rack-field">

              <label
                for="checkoutStreet"
              >
                Street / Block
              </label>

              <input
                id="checkoutStreet"
                name="street"
                type="text"
                placeholder="e.g. Street 12, Block B"
                autocomplete="street-address"
                required
              >

            </div>


            <div class="open-rack-field full">

              <label
                for="checkoutHouse"
              >
                House / Building
              </label>

              <input
                id="checkoutHouse"
                name="house"
                type="text"
                placeholder="e.g. House 24"
                autocomplete="street-address"
                required
              >

            </div>

          </div>


          <div
            class="open-rack-checkout-error"
            id="openRackCheckoutError"
            role="alert"
          ></div>

        </div>

      </form>


      <div
        class="open-rack-checkout-footer"
      >

        <button
          type="button"
          class="open-rack-checkout-cancel"
          id="openRackCheckoutCancel"
        >
          BACK
        </button>


        <button
          type="submit"
          form="openRackCheckoutForm"
          class="open-rack-checkout-submit"
        >
          CONTINUE TO WHATSAPP
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    dialog
  );


  const closeButton =
    dialog.querySelector(
      "#openRackCheckoutClose"
    );


  const cancelButton =
    dialog.querySelector(
      "#openRackCheckoutCancel"
    );


  const form =
    dialog.querySelector(
      "#openRackCheckoutForm"
    );


  closeButton?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      closeCheckoutDialog();
    }
  );


  cancelButton?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      closeCheckoutDialog();
    }
  );


  dialog.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        dialog
      ) {
        closeCheckoutDialog();
      }
    }
  );


  form?.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      submitCheckoutForm(
        form,
        dialog
      );
    }
  );


  dialog.addEventListener(
    "close",
    () => {

      document.body.classList.remove(
        "checkout-open"
      );

      updateBodyLock();
    }
  );


  return dialog;
}


/* =====================================================
   OPEN CHECKOUT
===================================================== */

function openCheckoutDialog() {
  if (!cart.length) {
    return;
  }


  closeBagPanel();

  closeSearch();

  closeContactPanel();

  closeProductModal();


  const dialog =
    createCheckoutDialog();


  const form =
    document.getElementById(
      "openRackCheckoutForm"
    );


  const error =
    document.getElementById(
      "openRackCheckoutError"
    );


  if (form) {

    form.reset();


    const country =
      form.querySelector(
        "#checkoutCountry"
      );


    if (country) {
      country.value =
        "Pakistan";
    }
  }


  if (error) {

    error.textContent =
      "";

    error.style.display =
      "none";
  }


  try {

    if (
      typeof dialog.showModal ===
      "function"
    ) {

      dialog.showModal();

    } else {

      dialog.setAttribute(
        "open",
        ""
      );
    }

  } catch {

    dialog.setAttribute(
      "open",
      ""
    );
  }


  document.body.classList.add(
    "checkout-open"
  );


  updateBodyLock();
}


function closeCheckoutDialog() {
  const dialog =
    document.getElementById(
      "openRackCheckoutDialog"
    );


  if (!dialog) {
    return;
  }


  try {

    if (
      dialog.open &&
      typeof dialog.close ===
        "function"
    ) {

      dialog.close();

    } else {

      dialog.removeAttribute(
        "open"
      );

      document.body.classList.remove(
        "checkout-open"
      );

      updateBodyLock();
    }

  } catch {

    dialog.removeAttribute(
      "open"
    );

    document.body.classList.remove(
      "checkout-open"
    );

    updateBodyLock();
  }
}


/* =====================================================
   CHECKOUT FORM
===================================================== */

function submitCheckoutForm(
  form,
  dialog
) {
  if (!form) {
    return;
  }


  if (
    !form.checkValidity()
  ) {

    form.reportValidity();

    return;
  }


  const formData =
    new FormData(form);


  const paymentMethod =
    String(
      formData.get(
        "paymentMethod"
      ) || ""
    ).trim();


  const country =
    String(
      formData.get(
        "country"
      ) || ""
    ).trim();


  const city =
    String(
      formData.get(
        "city"
      ) || ""
    ).trim();


  const area =
    String(
      formData.get(
        "area"
      ) || ""
    ).trim();


  const street =
    String(
      formData.get(
        "street"
      ) || ""
    ).trim();


  const house =
    String(
      formData.get(
        "house"
      ) || ""
    ).trim();


  const error =
    document.getElementById(
      "openRackCheckoutError"
    );


  if (
    !paymentMethod ||
    !country ||
    !city ||
    !area ||
    !street ||
    !house
  ) {

    if (error) {

      error.textContent =
        "Please complete all payment and delivery details.";

      error.style.display =
        "block";
    }

    return;
  }


  const message =
    buildWhatsAppOrderMessage({
      paymentMethod,
      country,
      city,
      area,
      street,
      house
    });


  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;


  try {

    if (
      dialog?.open &&
      typeof dialog.close ===
        "function"
    ) {
      dialog.close();
    }

  } catch {
    dialog?.removeAttribute(
      "open"
    );
  }


  document.body.classList.remove(
    "checkout-open"
  );


  updateBodyLock();


  /*
   * Open the exact Open Rack WhatsApp number.
   */
  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}


/* =====================================================
   WHATSAPP ORDER MESSAGE
===================================================== */

function buildWhatsAppOrderMessage(
  details
) {
  const lines = [];


  lines.push(
    "OPEN RACK ORDER"
  );

  lines.push(
    "===================="
  );

  lines.push("");


  let itemNumber = 0;


  cart.forEach(
    item => {

      const product =
        getProductById(
          item.productId
        );


      if (!product) {
        return;
      }


      itemNumber += 1;


      lines.push(
        `${itemNumber}. ${product.name}`
      );


      lines.push(
        `Quantity: ${item.quantity}`
      );


      if (
        item.size &&
        item.size !==
          "STANDARD"
      ) {

        lines.push(
          `Size: ${item.size}`
        );
      }


      lines.push(
        `Unit Price: ${formatPrice(
          product.price
        )}`
      );


      lines.push(
        `Item Total: ${formatPrice(
          product.price *
          item.quantity
        )}`
      );


      lines.push("");
    }
  );


  lines.push(
    "ORDER TOTAL"
  );


  lines.push(
    formatPrice(
      getCartTotal()
    )
  );


  lines.push("");


  lines.push(
    "PAYMENT METHOD"
  );


  lines.push(
    details.paymentMethod
  );


  lines.push("");


  lines.push(
    "DELIVERY LOCATION"
  );


  lines.push(
    `Country: ${details.country}`
  );


  lines.push(
    `City: ${details.city}`
  );


  lines.push(
    `Area: ${details.area}`
  );


  lines.push(
    `Street / Block: ${details.street}`
  );


  lines.push(
    `House / Building: ${details.house}`
  );


  lines.push("");


  lines.push(
    "Please confirm availability and delivery details."
  );


  return lines.join(
    "\n"
  );
}


/* =====================================================
   SEARCH
===================================================== */

function openSearch() {
  closeBagPanel();

  closeContactPanel();

  closeProductModal();


  searchPanel?.classList.add(
    "open"
  );


  document.body.classList.add(
    "search-open"
  );


  updateBodyLock();


  window.setTimeout(
    () => {
      searchInput?.focus();
    },
    100
  );


  renderSearchResults(
    searchInput?.value || ""
  );
}


function closeSearch() {
  searchPanel?.classList.remove(
    "open"
  );


  document.body.classList.remove(
    "search-open"
  );


  updateBodyLock();
}


function clearSearch() {
  if (!searchInput) {
    return;
  }


  searchInput.value =
    "";


  renderSearchResults(
    ""
  );


  searchInput.focus();
}


function searchProducts(
  query
) {
  const normalizedQuery =
    normalizeText(
      query
    );


  if (!normalizedQuery) {
    return products.slice();
  }


  return products.filter(
    product => {

      const searchableText = [
        product.name,
        product.section,
        product.category,
        product.color,
        ...(product.filters || []),
        ...(product.sizes || [])
      ]
        .join(" ")
        .toLowerCase();


      return searchableText.includes(
        normalizedQuery
      );
    }
  );
}


function renderSearchResults(
  query
) {
  if (!searchResults) {
    return;
  }


  const results =
    searchProducts(
      query
    );


  searchResults.innerHTML =
    "";


  if (!results.length) {

    const empty =
      document.createElement(
        "div"
      );


    empty.className =
      "search-no-results";


    empty.textContent =
      `No products found for "${query}".`;


    searchResults.appendChild(
      empty
    );


    return;
  }


  const fragment =
    document.createDocumentFragment();


  results.forEach(
    product => {

      const result =
        document.createElement(
          "button"
        );


      result.type =
        "button";


      result.className =
        "search-result";


      result.dataset.productId =
        product.id;


      const imageWrapper =
        document.createElement(
          "div"
        );


      imageWrapper.className =
        "search-result-image";


      const image =
        document.createElement(
          "img"
        );


      image.src =
        getProductImage(
          product
        );


      image.alt =
        product.name;


      image.loading =
        "lazy";


      image.addEventListener(
        "error",
        () => {
          image.style.display =
            "none";
        }
      );


      imageWrapper.appendChild(
        image
      );


      const info =
        document.createElement(
          "div"
        );


      info.className =
        "search-result-info";


      const name =
        document.createElement(
          "strong"
        );


      name.textContent =
        product.name;


      const category =
        document.createElement(
          "span"
        );


      category.textContent =
        `${product.section.toUpperCase()} • ${product.category}`;


      const price =
        document.createElement(
          "div"
        );


      price.className =
        "search-result-price";


      price.textContent =
        formatPrice(
          product.price
        );


      info.appendChild(
        name
      );

      info.appendChild(
        category
      );

      info.appendChild(
        price
      );


      result.appendChild(
        imageWrapper
      );

      result.appendChild(
        info
      );


      result.addEventListener(
        "click",
        () => {

          closeSearch();

          openProductModal(
            product.id
          );
        }
      );


      fragment.appendChild(
        result
      );
    }
  );


  searchResults.appendChild(
    fragment
  );
}


/* =====================================================
   FILTER HELPERS
===================================================== */

function getFilterSection(
  button,
  container
) {
  if (
    button?.dataset.section
  ) {
    return normalizeText(
      button.dataset.section
    );
  }


  if (
    container?.dataset.section
  ) {
    return normalizeText(
      container.dataset.section
    );
  }


  const collection =
    button?.closest(
      "section, [id$='-collection'], .collection-section"
    );


  if (collection) {

    if (
      collection.dataset.section
    ) {

      return normalizeText(
        collection.dataset.section
      );
    }


    const id =
      normalizeText(
        collection.id
      )
        .replace(
          "-collection",
          ""
        );


    if (
      [
        "men",
        "women",
        "kids",
        "accessories"
      ].includes(id)
    ) {
      return id;
    }


    for (
      const section of [
        "men",
        "women",
        "kids",
        "accessories"
      ]
    ) {

      if (
        collection.classList.contains(
          `${section}-collection`
        )
      ) {

        return section;
      }
    }
  }


  return "";
}


function getFilterValue(
  button
) {
  if (
    button?.dataset.filter
  ) {

    return normalizeText(
      button.dataset.filter
    );
  }


  if (
    button?.dataset.category
  ) {

    return normalizeText(
      button.dataset.category
    );
  }


  const text =
    normalizeText(
      button?.textContent
    );


  const aliases = {
    "all products":
      "all",

    "all items":
      "all",

    "all":
      "all",

    "new arrivals":
      "new",

    "shirts":
      "shirt",

    "jackets":
      "jacket",

    "tops":
      "tops",

    "bottoms":
      "bottoms",

    "shoes":
      "shoes",

    "accessories":
      "accessories"
  };


  return (
    aliases[text] ||
    text
  );
}


/* =====================================================
   FILTERS
===================================================== */

function setupFilters() {
  const containers =
    document.querySelectorAll(
      ".product-tabs"
    );


  containers.forEach(
    container => {

      const buttons =
        container.querySelectorAll(
          "button"
        );


      buttons.forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              event.stopPropagation();


              const section =
                getFilterSection(
                  button,
                  container
                );


              const filter =
                getFilterValue(
                  button
                );


              if (!section) {

                console.warn(
                  "OPEN RACK: Filter button has no section.",
                  button
                );

                return;
              }


              /*
               * Update visual active state.
               */
              buttons.forEach(
                tabButton => {

                  const active =
                    tabButton ===
                    button;


                  tabButton.classList.toggle(
                    "active",
                    active
                  );


                  tabButton.setAttribute(
                    "aria-selected",
                    active
                      ? "true"
                      : "false"
                  );
                }
              );


              renderProducts(
                section,
                filter ||
                  "all"
              );
            }
          );
        }
      );
    }
  );
}


/* =====================================================
   BANNER FILTER TARGETS
===================================================== */

function setupFilterTargetLinks() {
  document
    .querySelectorAll(
      "[data-filter-target]"
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            const filter =
              normalizeText(
                link.dataset.filterTarget
              );


            const targetId =
              link.getAttribute(
                "href"
              );


            if (
              !targetId ||
              targetId === "#"
            ) {
              return;
            }


            let target = null;


            try {

              target =
                document.querySelector(
                  targetId
                );

            } catch {

              return;
            }


            if (!target) {
              return;
            }


            const section =
              getSectionFromTarget(
                target
              );


            if (!section) {
              return;
            }


            const targetTab =
              Array.from(
                document.querySelectorAll(
                  ".product-tabs button"
                )
              ).find(
                button => {

                  const container =
                    button.closest(
                      ".product-tabs"
                    );


                  return (
                    getFilterSection(
                      button,
                      container
                    ) ===
                      section &&
                    getFilterValue(
                      button
                    ) ===
                      filter
                  );
                }
              );


            targetTab?.click();
          }
        );
      }
    );
}


function getSectionFromTarget(
  target
) {
  if (
    target?.dataset.section
  ) {

    return normalizeText(
      target.dataset.section
    );
  }


  const id =
    normalizeText(
      target?.id
    )
      .replace(
        "-collection",
        ""
      );


  if (
    [
      "men",
      "women",
      "kids",
      "accessories"
    ].includes(id)
  ) {
    return id;
  }


  for (
    const section of [
      "men",
      "women",
      "kids",
      "accessories"
    ]
  ) {

    if (
      target?.classList.contains(
        `${section}-collection`
      )
    ) {

      return section;
    }
  }


  return "";
}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {
  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            /*
             * Leave bag controls,
             * filters, and custom controls
             * to their own handlers.
             */
            if (
              link.matches(
                ".bag-toggle, " +
                "[data-open-bag], " +
                "#mobileBagBtn, " +
                "#openBag, " +
                "#bagButton, " +
                "[data-filter-target]"
              )
            ) {
              return;
            }


            if (
              link.closest(
                ".product-tabs"
              )
            ) {
              return;
            }


            if (
              link.dataset.placeholderLink
            ) {

              event.preventDefault();

              return;
            }


            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {
              return;
            }


            let target = null;


            try {

              target =
                document.querySelector(
                  href
                );

            } catch {

              return;
            }


            if (!target) {
              return;
            }


            event.preventDefault();


            closeSearch();

            closeBagPanel();

            closeContactPanel();


            target.scrollIntoView({
              behavior:
                "smooth",

              block:
                "start"
            });
          }
        );
      }
    );
}


/* =====================================================
   CONTACT PANEL
===================================================== */

function openContactPanel() {
  closeSearch();

  closeBagPanel();

  closeProductModal();


  contactPanel?.classList.add(
    "open"
  );


  document.body.classList.add(
    "contact-open"
  );


  updateBodyLock();
}


function closeContactPanel() {
  contactPanel?.classList.remove(
    "open"
  );


  document.body.classList.remove(
    "contact-open"
  );


  updateBodyLock();
}


function toggleContactPanel() {
  if (
    contactPanel?.classList.contains(
      "open"
    )
  ) {

    closeContactPanel();

  } else {

    openContactPanel();
  }
}


/* =====================================================
   NAVBAR
===================================================== */

function updateNavbar() {
  const navbar =
    document.querySelector(
      ".navbar"
    );


  if (!navbar) {
    return;
  }


  navbar.classList.toggle(
    "scrolled",
    window.scrollY >
      25
  );
}


/* =====================================================
   PRODUCT EVENTS
===================================================== */

function setupProductEvents() {
  document.addEventListener(
    "click",
    event => {

      const bagButton =
        event.target.closest(
          ".bag-btn"
        );


      if (bagButton) {

        event.preventDefault();

        event.stopPropagation();


        const productId =
          bagButton.dataset.productId;


        const product =
          getProductById(
            productId
          );


        if (!product) {
          return;
        }


        /*
         * Products with sizes
         * require a size selection.
         */
        if (
          hasProductSizes(
            product
          )
        ) {

          openProductModal(
            productId
          );

          return;
        }


        /*
         * STANDARD products can
         * be added immediately.
         */
        const added =
          addToCart(
            productId,
            "STANDARD"
          );


        if (added) {

          showAddedFeedback(
            bagButton
          );

          openBag();
        }


        return;
      }


      const productCard =
        event.target.closest(
          ".men-product, " +
          ".women-product, " +
          ".kids-product, " +
          ".accessories-product"
        );


      if (!productCard) {
        return;
      }


      if (
        event.target.closest(
          ".bag-btn"
        )
      ) {
        return;
      }


      const productId =
        productCard.dataset.productId;


      if (!productId) {
        return;
      }


      openProductModal(
        productId
      );
    }
  );
}


/* =====================================================
   ADD TO BAG FEEDBACK
===================================================== */

function showAddedFeedback(
  button
) {
  if (!button) {
    return;
  }


  const originalText =
    button.textContent;


  button.textContent =
    "ADDED";


  button.disabled =
    true;


  window.setTimeout(
    () => {

      button.textContent =
        originalText;

      button.disabled =
        false;

    },
    900
  );
}


/* =====================================================
   MODAL ADD TO BAG
===================================================== */

function setupModalAddToBag() {
  productOrderBtn?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();


      if (!currentProduct) {
        return;
      }


      if (
        hasProductSizes(
          currentProduct
        ) &&
        !selectedSize
      ) {

        if (
          productModalSelectedSize
        ) {

          productModalSelectedSize.textContent =
            "SELECT A SIZE";


          productModalSelectedSize.style.color =
            "var(--danger, #B00020)";
        }


        return;
      }


      if (
        productModalSelectedSize
      ) {

        productModalSelectedSize.style.color =
          "";
      }


      const added =
        addToCart(
          currentProduct.id,
          selectedSize
        );


      if (!added) {
        return;
      }


      closeProductModal();

      openBag();
    }
  );
}


/* =====================================================
   MODAL EVENTS
===================================================== */

function setupModalEvents() {

  productModalClose?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      closeProductModal();
    }
  );


  productModalPrev?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      showModalImage(
        currentProductImage - 1
      );
    }
  );


  productModalNext?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      showModalImage(
        currentProductImage + 1
      );
    }
  );


  productModalOverlay?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        productModalOverlay
      ) {

        closeProductModal();
      }
    }
  );
}


/* =====================================================
   BAG EVENTS
===================================================== */

function setupBagEvents() {

  closeBag?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeBagPanel();
    }
  );


  bagOverlay?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        bagOverlay
      ) {

        closeBagPanel();
      }
    }
  );


  checkoutBtn?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      openCheckoutDialog();
    }
  );
}


/* =====================================================
   SEARCH EVENTS
===================================================== */

function setupSearchEvents() {

  searchBtn?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      openSearch();
    }
  );


  mobileSearchBtn?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      openSearch();
    }
  );


  searchClose?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      closeSearch();
    }
  );


  searchClear?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      clearSearch();
    }
  );


  searchInput?.addEventListener(
    "input",
    () => {

      clearTimeout(
        searchDebounceTimer
      );


      searchDebounceTimer =
        window.setTimeout(
          () => {

            renderSearchResults(
              searchInput.value
            );

          },
          120
        );
    }
  );


  searchPanel?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        searchPanel
      ) {

        closeSearch();
      }
    }
  );
}


/* =====================================================
   CONTACT EVENTS
===================================================== */

function setupContactEvents() {

  contactBtn?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      toggleContactPanel();
    }
  );


  contactClose?.addEventListener(
    "click",
    event => {

      event.preventDefault();

      closeContactPanel();
    }
  );
}


/* =====================================================
   PLACEHOLDER LINKS
===================================================== */

function setupPlaceholderLinks() {
  document
    .querySelectorAll(
      "[data-placeholder-link]"
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          event => {

            event.preventDefault();
          }
        );
      }
    );
}


/* =====================================================
   MODAL TOUCH SWIPE
===================================================== */

function setupModalSwipe() {

  productModalImages?.addEventListener(
    "touchstart",
    event => {

      const touch =
        event.changedTouches?.[0];


      if (!touch) {
        return;
      }


      touchStartX =
        touch.screenX;
    },
    {
      passive: true
    }
  );


  productModalImages?.addEventListener(
    "touchend",
    event => {

      const touch =
        event.changedTouches?.[0];


      if (!touch) {
        return;
      }


      touchEndX =
        touch.screenX;


      const difference =
        touchEndX -
        touchStartX;


      if (
        Math.abs(
          difference
        ) < 45
      ) {
        return;
      }


      if (
        difference < 0
      ) {

        showModalImage(
          currentProductImage +
            1
        );

      } else {

        showModalImage(
          currentProductImage -
            1
        );
      }
    },
    {
      passive: true
    }
  );
}


/* =====================================================
   EMAIL LINKS
===================================================== */

function setupEmailLinks() {
  document
    .querySelectorAll(
      "[data-contact-email]"
    )
    .forEach(
      link => {

        link.href =
          `mailto:${EMAIL_ADDRESS}`;
      }
    );
}


/* =====================================================
   WHATSAPP LINKS
===================================================== */

function setupWhatsAppLinks() {
  const selectors = [
    "[data-whatsapp-link]",
    'a[href*="wa.me"]',
    'a[href*="whatsapp.com"]',
    ".whatsapp-btn",
    ".main-whatsapp-btn"
  ];


  document
    .querySelectorAll(
      selectors.join(", ")
    )
    .forEach(
      link => {

        link.href =
          `https://wa.me/${WHATSAPP_NUMBER}`;


        link.target =
          "_blank";


        link.rel =
          "noopener noreferrer";
      }
    );
}


/* =====================================================
   PREVENT WRONG HARD-CODED WHATSAPP LINKS
===================================================== */

function enforceWhatsAppNumber() {
  const allLinks =
    document.querySelectorAll(
      "a"
    );


  allLinks.forEach(
    link => {

      const href =
        link.getAttribute(
          "href"
        );


      if (!href) {
        return;
      }


      const normalized =
        href.toLowerCase();


      if (
        normalized.includes(
          "wa.me/"
        ) ||
        normalized.includes(
          "whatsapp.com"
        )
      ) {

        link.href =
          `https://wa.me/${WHATSAPP_NUMBER}`;

        link.target =
          "_blank";

        link.rel =
          "noopener noreferrer";
      }
    }
  );
}


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

function setupKeyboardControls() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        const checkoutDialog =
          document.getElementById(
            "openRackCheckoutDialog"
          );


        if (
          checkoutDialog?.open
        ) {

          closeCheckoutDialog();

          return;
        }


        if (
          productModalOverlay?.classList.contains(
            "open"
          )
        ) {

          closeProductModal();

          return;
        }


        if (
          bagPanel?.classList.contains(
            "open"
          )
        ) {

          closeBagPanel();

          return;
        }


        if (
          searchPanel?.classList.contains(
            "open"
          )
        ) {

          closeSearch();

          return;
        }


        if (
          contactPanel?.classList.contains(
            "open"
          )
        ) {

          closeContactPanel();

          return;
        }
      }


      if (
        productModalOverlay?.classList.contains(
          "open"
        )
      ) {

        if (
          event.key ===
          "ArrowLeft"
        ) {

          event.preventDefault();

          showModalImage(
            currentProductImage -
              1
          );
        }


        if (
          event.key ===
          "ArrowRight"
        ) {

          event.preventDefault();

          showModalImage(
            currentProductImage +
              1
          );
        }
      }
    }
  );
}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
  "resize",
  () => {
    updateBagCounts();
  },
  {
    passive: true
  }
);


/* =====================================================
   SCROLL
===================================================== */

window.addEventListener(
  "scroll",
  updateNavbar,
  {
    passive: true
  }
);


/* =====================================================
   INITIALIZATION
===================================================== */

function init() {

  /*
   * Products
   */
  renderAllProducts();


  /*
   * Filters
   */
  setupFilters();

  setupFilterTargetLinks();


  /*
   * Navigation
   */
  setupNavigation();


  /*
   * Product interactions
   */
  setupProductEvents();

  setupModalEvents();

  setupModalAddToBag();

  setupModalSwipe();


  /*
   * Bag
   */
  setupGlobalBagClickHandler();

  setupBagEvents();


  /*
   * Search
   */
  setupSearchEvents();


  /*
   * Contact
   */
  setupContactEvents();


  /*
   * Misc links
   */
  setupPlaceholderLinks();

  setupEmailLinks();

  setupWhatsAppLinks();

  enforceWhatsAppNumber();


  /*
   * Keyboard
   */
  setupKeyboardControls();


  /*
   * Checkout
   */
  createCheckoutDialog();


  /*
   * Initial UI
   */
  updateBag();

  updateBagCounts();

  updateNavbar();
}


/* =====================================================
   START
===================================================== */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    init,
    {
      once: true
    }
  );

} else {

  init();
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');

function closeMobileMenu() {
  mobileMenuPanel.classList.remove('open');
  mobileMenuPanel.setAttribute('aria-hidden', 'true');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

function openMobileMenu() {
  mobileMenuPanel.classList.add('open');
  mobileMenuPanel.setAttribute('aria-hidden', 'false');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
}

mobileMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenuPanel.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});

mobileMenuPanel.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('click', (e) => {
  if (!mobileMenuPanel.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});