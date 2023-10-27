// Khi trang được tải lại, hiển thị spinner
document.addEventListener("DOMContentLoaded", () => {
  fetchProductList().then(() => {
    hideSpinner(); // Ẩn spinner sau khi danh sách sản phẩm đã được tải xong
  });
});

// Hiển thị spinner và làm mờ nội dung
export function showSpinner() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "block";
}

// Ẩn spinner và khôi phục nội dung bình thường
export function hideSpinner() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

// Button shop
function scrollToProducts() {
  // Lấy phần tử "products" bằng cách sử dụng class
  var productsElement = document.querySelector(".products");

  // Sử dụng phương thức scrollIntoView để cuộn trang đến phần tử "products"
  if (productsElement) {
    productsElement.scrollIntoView({ behavior: "smooth" });
  }
}
window.scrollToProducts = scrollToProducts;
window.filterProducts = filterProducts;
var dssp = []; // Định nghĩa biến dssp ở ngoài phạm vi của hàm

function renderProductionList(dssp) {
  var productContainer = document.getElementById("product-container");
  productContainer.innerHTML = ""; // Xóa nội dung cũ trong container trước khi thêm dữ liệu mới

  dssp.forEach((product) => {
    var productDiv = document.createElement("div");
    productDiv.classList.add("item");
    productDiv.innerHTML = `
      <div class="item">
        <img class="image" src="${product.img}" alt="${product.name}" />
        <div class="desc">
          <div class="detail">
            <h3>${product.name}</h3>
            <p>${product.type}</p>
            <div>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
          <div class="price">
            <span>${product.price}$</span>
            <button class="add-to-cart">Add to cart</button>
          </div>
        </div>
      </div>
    `;

    productContainer.appendChild(productDiv);

    // Thêm sự kiện click vào nút "Add to Cart"
    const addToCartButton = productDiv.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", () => {
      addToCart(productDiv);
    });
  });
}

//------------------------------Lọc sản phẩm--------------------
// Hàm lọc danh sách sản phẩm theo loại sản phẩm
function filterProducts() {
  // Hiển thị spinner
  showSpinner();

  var filterSelect = document.getElementById("filterSelect");

  // Kiểm tra xem filterSelect có tồn tại không
  if (filterSelect) {
    var selectedOption = filterSelect.value;

    // Lọc danh sách sản phẩm dựa trên loại sản phẩm đã chọn
    var filteredProducts;

    if (selectedOption === "") {
      // Nếu chọn "Tất cả", trả về tất cả sản phẩm
      filteredProducts = dssp;
    } else {
      // Ngược lại, lọc theo loại sản phẩm đã chọn
      filteredProducts = dssp.filter(function (product) {
        return product.type.toLowerCase() === selectedOption;
      });
    }

    // Gọi hàm để hiển thị danh sách sản phẩm đã được lọc
    renderProductionList(filteredProducts);

    // Ẩn spinner sau khi hoàn thành
    hideSpinner();
  }
}

// Gọi api lấy danh sách sản phẩm đang có từ server
function fetchProductList() {
  return axios({
    url: "https://6520dbe6906e276284c4beec.mockapi.io/Products",
    method: "GET",
  })
    .then((res) => {
      // Api trả về thành công
      dssp = res.data; // Gán danh sách sản phẩm cho biến dssp

      // Gọi hàm filterProducts để hiển thị danh sách sản phẩm ban đầu
      filterProducts();

      // Xử lý dữ liệu và trả về dữ liệu cần thiết dưới dạng promise
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      console.log(err);
      throw err; // Rethrow lỗi để xử lý ở nơi khác nếu cần
    });
}

fetchProductList();
//------------------------Giỏ hàng--------------------------

// Khai báo mảng để lưu trữ các sản phẩm trong giỏ hàng
const cart = [];

// Hàm để lấy thông tin sản phẩm từ phần tử sản phẩm
function getDataItem(productElement) {
  // Lấy các phần tử con tương ứng trong phần tử sản phẩm
  var nameElement = productElement.querySelector("h3");
  var priceElement = productElement.querySelector(".price span");
  var imgElement = productElement.querySelector(".image");
  var typeElement = productElement.querySelector("p");

  // Trích xuất thông tin từ các phần tử HTML
  var nameItem = nameElement.textContent;
  var priceItem = priceElement.textContent;
  var imgItem = imgElement.src;
  var typeItem = typeElement.textContent;

  // Tạo đối tượng sản phẩm từ thông tin trích xuất
  return {
    name: nameItem,
    price: priceItem,
    img: imgItem,
    type: typeItem,
  };
}

let productList = [];

export let productList_localStorage = "productList_localStorage";

// Render lại data từ local storage khi user reload
var dataJson = localStorage.getItem(productList_localStorage);

if (dataJson != null) {
  productList = JSON.parse(dataJson); // Gán dữ liệu từ localStorage vào productList
}

// Export biến productList
export default productList;
window.productList = productList;

function calculateTotalQuality() {
  const totalQuality = productList.reduce(
    (total, item) => total + item.quality,
    0
  );
  return totalQuality;
}

// Gọi hàm để tính tổng quality
const totalQuality = calculateTotalQuality();

// Hiển thị giá trị tổng quality trong thẻ cart-count
const cartCountElement = document.getElementById("cart-count");
cartCountElement.textContent = totalQuality;

function calculateTotalQuantityInCart() {
  const totalQuantity = cart.reduce((total, item) => total + item.quality, 0);
  return totalQuantity;
}

import { updateCartCount } from "./cart_index.js";

// Hàm để thêm sản phẩm vào mảng productList
function addToProductList(product) {
  const existingProduct = productList.find(
    (item) => item.name === product.name
  );

  if (existingProduct) {
    // Nếu sản phẩm đã có trong productList, cập nhật quality
    existingProduct.quality = cart.find(
      (item) => item.name === product.name
    ).quality;
  } else {
    // Nếu sản phẩm chưa có trong productList, thêm mới
    productList.push(product);
  }

  // Lưu sản phẩm xuống localStorage
  saveProductListToLocalStorage();

  console.log("Danh sách sản phẩm sau khi thêm/sửa: ", productList);
}

// Hàm để lưu productList xuống localStorage
function saveProductListToLocalStorage() {
  localStorage.setItem(productList_localStorage, JSON.stringify(productList));
}

// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(productElement) {
  // Hiển thị spinner
  showSpinner();

  try {
    // Lấy thông tin sản phẩm từ hàm getDataItem
    const selectedProduct = getDataItem(productElement);

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = cart.find(
      (item) => item.name === selectedProduct.name
    );

    if (existingCartItem) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng quality lên 1 đơn vị
      existingCartItem.quality += 1;
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào giỏ hàng với quality là 1
      selectedProduct.quality = 1;
      cart.push(selectedProduct);
    }

    // Thêm sản phẩm vào productList và cập nhật quality
    addToProductList(selectedProduct);

    // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
    updateCartCount();

    hideSpinner(); // Ẩn spinner sau khi thêm sản phẩm thành công
  } catch (error) {
    // Xảy ra lỗi khi thêm, sau đó ẩn spinner và khôi phục nội dung
    hideSpinner();
    console.error("Thêm thất bại", error);
    alert("Thêm sản phẩm thất bại: " + error.message);
  }
}
