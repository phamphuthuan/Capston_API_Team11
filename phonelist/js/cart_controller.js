import { updateTotalPrice } from "./cart_index.js";
import { productList_localStorage } from "./index.js";

// Hàm để cập nhật dữ liệu trong Local Storage
function updateLocalStorage() {
  // Convert danh sách sản phẩm thành JSON và lưu vào Local Storage
  const dataJson = JSON.stringify(productList);
  localStorage.setItem(productList_localStorage, dataJson);
}

// Hàm để thêm sản phẩm vào giỏ hàng
function addItem(tableRowId) {
  // Tìm phần tử tr trong bảng dựa trên tableRowId
  const tableRow = document.getElementById(tableRowId);

  if (tableRow) {
    // Lấy thông tin sản phẩm từ hàng bảng
    const productName = tableRow.querySelector("td:nth-child(2)").textContent;

    // Tìm sản phẩm trong danh sách sản phẩm dựa trên tên sản phẩm
    const selectedProduct = productList.find(
      (item) => item.name === productName
    );

    if (selectedProduct) {
      // Tăng số lượng sản phẩm trong giỏ hàng
      selectedProduct.quality += 1;

      // Cập nhật số lượng trong bảng
      const qualityCell = tableRow.querySelector("td:nth-child(5)");
      if (qualityCell) {
        qualityCell.textContent = selectedProduct.quality;
      }

      // Cập nhật tổng số lượng và giá sản phẩm trong giỏ hàng
      updateCartCount();
      updateTotalPrice();
      // Cập nhật dữ liệu mới vào Local Storage
      updateLocalStorage();
    }
  }
}
window.addItem = addItem;

// Hàm để giảm số lượng sản phẩm trong giỏ hàng
function subItem(tableRowId) {
  // Tìm phần tử tr trong bảng dựa trên tableRowId
  const tableRow = document.getElementById(tableRowId);

  if (tableRow) {
    // Lấy thông tin sản phẩm từ hàng bảng
    const productName = tableRow.querySelector("td:nth-child(2)").textContent;

    // Tìm sản phẩm trong danh sách sản phẩm dựa trên tên sản phẩm
    const selectedProduct = productList.find(
      (item) => item.name === productName
    );

    if (selectedProduct) {
      // Giảm số lượng sản phẩm trong giỏ hàng, nhưng không được dưới 1
      if (selectedProduct.quality > 1) {
        selectedProduct.quality -= 1;
      } else {
        selectedProduct.quality = 1; // Đảm bảo không thể giảm xuống dưới 1
      }

      // Cập nhật số lượng trong bảng
      const qualityCell = tableRow.querySelector("td:nth-child(5)");
      if (qualityCell) {
        qualityCell.textContent = selectedProduct.quality;
      }

      // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
      updateCartCount();
      updateTotalPrice();

      // Cập nhật dữ liệu mới vào Local Storage
      updateLocalStorage();
    }
  }
}
window.subItem = subItem;

// Hàm để xóa sản phẩm khỏi giỏ hàng
function deleteItem(tableRowId) {
  // Tìm phần tử tr trong bảng dựa trên tableRowId
  const tableRow = document.getElementById(tableRowId);

  if (tableRow) {
    // Lấy thông tin sản phẩm từ hàng bảng
    const productName = tableRow.querySelector("td:nth-child(2)").textContent;

    // Tìm vị trí của sản phẩm trong danh sách sản phẩm
    const productIndex = productList.findIndex(
      (item) => item.name === productName
    );

    if (productIndex !== -1) {
      // Xóa sản phẩm khỏi danh sách sản phẩm
      productList.splice(productIndex, 1);

      // Xóa dòng trong bảng
      tableRow.remove();

      // Cập nhật lại tổng giá trị và tổng số lượng sản phẩm
      updateTotalPrice();
      updateCartCount();

      // Cập nhật dữ liệu mới vào Local Storage
      updateLocalStorage();
    }
  }
}
window.deleteItem = deleteItem;


