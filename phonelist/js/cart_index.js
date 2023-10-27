// Khi trang được tải lại, hiển thị spinner
document.addEventListener("DOMContentLoaded", () => {
  renderItemList();
  hideSpinner(); // Ẩn spinner sau khi danh sách sản phẩm đã được tải xong
});

import productList from "./index.js";
import { showSpinner } from "./index.js";
import { hideSpinner } from "./index.js";
import { productList_localStorage } from "./index.js";

// Trong tệp cart_index.js
let tableIdCounter = 0;

// Các mã khác ở đây

export { tableIdCounter };

// Bây giờ bạn có thể sử dụng productList trong cart_index.js
console.log(productList);

export function updateCartCount() {
  const totalQuantity = productList.reduce(
    (total, item) => total + item.quality,
    0
  );
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = totalQuantity;
}

window.updateCartCount = updateCartCount;

export function renderItemList() {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  var contentHTML = "";
  var tblGioHang = document.getElementById("tblGioHang"); // Kiểm tra phần tử
  if (tblGioHang) {
    for (var i = 0; i < productList.length; i++) {
      var item = productList[i];
      // Tạo ID duy nhất cho bảng
      var tableId = `itemTable${i}`;
      var tableRowId = `itemTableRow${i}`;
      updateCartCount();
      var trString = `<tr id="${tableRowId}">
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.type}</td>
        <td>${item.quality}</td>
        <td>
        <button onclick="addItem('${tableRowId}')" class="btn btn-success">+</button>
        <button onclick="subItem('${tableRowId}')" class="btn btn-warning pr-3">-</button>
        <button onclick="deleteItem('${tableRowId}')"  class="btn btn-danger pr-3">X</button>
        </td>
    </tr>`;
      contentHTML += trString;
    }
    document.getElementById("tblGioHang").innerHTML = contentHTML;
    // Ẩn spinner và khôi phục nội dung bình thường
    hideSpinner();
  } else {
    console.error("Không tìm thấy phần tử có ID là 'tblGioHang'.");
  }
}

// Sử dụng hàm renderItemList và truyền vào productList
renderItemList();

export function updateTotalPrice() {
  const totalPriceElement = document.getElementById("total-price"); // Kiểm tra phần tử
  console.log("🚀 ~ totalPriceElement:", totalPriceElement);
  if (totalPriceElement) {
    // Tìm thấy phần tử, cập nhật thuộc tính 'textContent'
    const totalPrice = productList.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quality;
    }, 0);
    totalPriceElement.textContent = `$${totalPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else {
    console.error("Không tìm thấy phần tử có ID là 'total-price'.");
  }
}

// Gọi hàm updateTotalPrice để cập nhật tổng giá trị ban đầu
updateTotalPrice();


// Xóa giỏ hàng và cập nhật giao diện
const ThanhToan = () => {
  productList.length = 0; // Set mảng giỏ hàng về rỗng
  updateCartCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng
  renderItemList(); // Cập nhật danh sách sản phẩm trong giỏ hàng
  updateTotalPrice(); // Cập nhật tổng giá trị

  // Xóa dữ liệu trong local storage 
  localStorage.removeItem(productList_localStorage); // Xóa dữ liệu giỏ hàng trong local storage
};
window.ThanhToan = ThanhToan;

