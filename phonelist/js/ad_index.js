import { kiemTraRong } from "./ad_validate.js";

var dssp = [];

// Khi trang được tải lại, hiển thị spinner
document.addEventListener("DOMContentLoaded", () => {
  showSpinner();
  fetchFoodList(); // Gọi hàm để tải danh sách sản phẩm lại sau khi trang được tải lại
});


// Hiển thị spinner và làm mờ nội dung
function showSpinner() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "block";
}

// Ẩn spinner và khôi phục nội dung bình thường
function hideSpinner() {
  var overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

//selected Id của product chọn để edit
var selectedId = null;

function renderProductionList(productArr) {
  // Xóa dữ liệu hiện tại trong mảng dssp
  dssp.length = 0;

  var contentHTML = "";
  for (var i = 0; i < productArr.length; i++) {
    var product = productArr[i];
    // Thêm sản phẩm vào mảng dssp
    dssp.push(product);
    var trString = `<tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.image}</td>
            <td>${product.type}</td>
            <td>${product.quality}</td>
            <td>
                <button onclick="deleteProduct(${product.id})" class="btn btn-warning  ">Delete</button>
                <button onclick="editProduct(${product.id})" class="btn btn-danger">Edit</button>
            </td>
        </tr>`;
    contentHTML += trString;
  }
  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}

var nextProductId = 1; // Bắt đầu từ ID 1 và tăng lên sau mỗi lần thêm sản phẩm mới

let originalProductList = []; // Biến lưu trữ danh sách sản phẩm ban đầu


axios({
  url: "https://6520dbe6906e276284c4beec.mockapi.io/Products",
  method: "GET",
})
  .then((res) => {
    // Api trả về thành công
    renderProductionList(res.data);

    // Tìm giá trị ID lớn nhất trong danh sách đã có
    let maxId = 0;
    res.data.forEach((product) => {
      const productId = parseInt(product.id);
      if (!isNaN(productId) && productId > maxId) {
        maxId = productId;
      }
    });

    // Lưu danh sách sản phẩm ban đầu vào biến tạm thời
    originalProductList = res.data;

    // Cập nhật nextProductId thành giá trị lớn nhất tìm được + 1
    nextProductId = maxId + 1;
  })
  .catch((err) => {
    console.log(err);
  });

// gọi api lấy danh sách sản phẩm đang có từ sever
axios({
  url: "https://6520dbe6906e276284c4beec.mockapi.io/Products",
  method: "GET",
})
  .then((res) => {
    //api trả về thành công
    renderProductionList(res.data);

    // Tìm giá trị ID lớn nhất trong danh sách đã có
    let maxId = 0;
    res.data.forEach((product) => {
      const productId = parseInt(product.id);
      if (!isNaN(productId) && productId > maxId) {
        maxId = productId;
      }
    });

    // Cập nhật nextProductId thành giá trị lớn nhất tìm được + 1
    nextProductId = maxId + 1;
  })
  .catch((err) => {
    console.log(err);
  });





async function deleteProduct(id) {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  try {
    const response = await axios.delete(
      `https://6520dbe6906e276284c4beec.mockapi.io/Products/${id}`
    );
    console.log("Xóa thành công", response);
    // Sau khi xóa thành công, ẩn spinner và khôi phục nội dung
    hideSpinner();

    fetchFoodList(); // Gọi hàm để tải danh sách sản phẩm lại sau khi xóa
  } catch (error) {
    // Xảy ra lỗi khi xóa, sau đó ẩn spinner và khôi phục nội dung
    hideSpinner();
    console.error("Xóa thất bại", error);
    alert("Xóa sản phẩm thất bại: " + error.message);
  }
}
window.deleteProduct = deleteProduct;

async function addProduct() {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  try {
    var newProduct = getDataForm();

    // Tạo ID cho sản phẩm mới và cập nhật các trường khác
    newProduct.id = nextProductId.toString(); // Tạo ID cho sản phẩm mới
    newProduct.screen = ""; // Thêm trường screen (mục này cần được cập nhật với giá trị thích hợp)

    //validate new product
    var isValid =
      kiemTraRong(newProduct.name, "TenSP") &&
      kiemTraRong(newProduct.img, "HinhSP") &&
      kiemTraRong(newProduct.price, "GiaSP") &&
      kiemTraRong(newProduct.type, "LoaiSP");
      kiemTraRong(newProduct.quality, "soLuongSP");

    if (!isValid) {
      // nếu có trường input rỗng, hiển thị thông báo lỗi
      alert("Vui lòng nhập đầy đủ thông tin");
      // ẩn spinner và kết thúc hàm
      hideSpinner();
      return;
    }

    // Thực hiện thêm sản phẩm mới vào danh sách
    dssp.push(newProduct);

    // Sắp xếp lại danh sách sản phẩm theo id
    dssp.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const response = await axios.post(
      "https://6520dbe6906e276284c4beec.mockapi.io/Products",
      newProduct
    );
    console.log("Thêm thành công", response);
    // Sau khi thêm thành công, ẩn spinner và khôi phục nội dung
    hideSpinner();

    fetchFoodList(); // Gọi hàm để tải danh sách sản phẩm lại sau khi thêm
  } catch (error) {
    // Xảy ra lỗi khi thêm, sau đó ẩn spinner và khôi phục nội dung
    hideSpinner();
    console.error("Thêm thất bại", error);
    alert("Thêm sản phẩm thất bại: " + error.message);
  }
  closeModal();
}
window.addProduct = addProduct;

console.log("🚀 ~ dssp:", dssp);

function editProduct(id) {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  selectedId = id;
  axios({
    url: `https://6520dbe6906e276284c4beec.mockapi.io/Products/${id}`,
    method: "GET",
  })
    .then((res) => {
      console.log(res);
      $("#myModal").modal("show");
      // Đưa data từ máy chủ lên form
      showDataForm(res.data);
      // Sau khi lấy thông tin sản phẩm thành công, ẩn spinner
      hideSpinner();
    })
    .catch((err) => {
      console.log(err);
      // Xảy ra lỗi, ẩn spinner
      hideSpinner();
    });
}
window.editProduct = editProduct;

async function updateProduct(id) {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  try {
    
    // Lấy data vừa được cập nhật bởi người dùng từ form
    var updateProductData = getDataForm();
    const response = await axios.put(
      `https://6520dbe6906e276284c4beec.mockapi.io/Products/${selectedId}`,
      updateProductData
    );
    console.log("Sửa thành công", response);
    // Sau khi cập nhật thành công, ẩn spinner và khôi phục nội dung
    hideSpinner();

    fetchFoodList(); // Gọi hàm để tải danh sách sản phẩm lại sau khi cập nhật
  } catch (error) {
    // Xảy ra lỗi khi cập nhật, sau đó ẩn spinner và khôi phục nội dung
    hideSpinner();
    console.error("Sửa thất bại", error);
    alert("Sửa sản phẩm thất bại: " + error.message);
  }
  closeModal();
}
window.updateProduct = updateProduct;


async function fetchFoodList() {
  try {
    const response = await axios.get(
      "https://6520dbe6906e276284c4beec.mockapi.io/Products"
    );
    renderProductionList(response.data);
    originalProductList = response.data; // Lưu trữ danh sách ban đầu
    renderProductionList(originalProductList);

    hideSpinner(); // Ẩn spinner sau khi tải xong danh sách sản phẩm
  } catch (err) {
    console.log(err);
    hideSpinner(); // Ẩn spinner nếu có lỗi xảy ra
  }
}
fetchFoodList()
//---------------------Tìm kiếm----------------------------------
function searchButton() {
   // Hiển thị spinner và làm mờ nội dung
   showSpinner();
  var keyword = document.getElementById("searchInput").value.toLowerCase();
  var results = searchProductsByKeyword(keyword);
  renderProductionList(results);
  // Sau khi tìm kiếm xong, ẩn spinner và khôi phục nội dung
  hideSpinner();
}
window.searchButton = searchButton;

function searchProductsByKeyword(keyword) {
  // Tạo một mảng mới để lưu trữ các sản phẩm phù hợp với từ khóa
  var searchResults = [];

  // Sử dụng danh sách sản phẩm ban đầu để tìm kiếm
  var productListToSearch = originalProductList;

  // Lặp qua danh sách sản phẩm ban đầu để tìm kiếm
  for (var i = 0; i < productListToSearch.length; i++) {
    var product = productListToSearch[i];
    if (product.name.toLowerCase().includes(keyword)) {
      searchResults.push(product);
    }
  }

  return searchResults;
}


//------------------Sắp xếp-----------------------------------

// Khai báo một biến để lưu trữ danh sách sản phẩm đã được sắp xếp
let sortedProducts = [];

// Hàm sắp xếp danh sách sản phẩm
function sortProducts() {
  // Hiển thị spinner và làm mờ nội dung
  showSpinner();

  var sortSelect = document.getElementById("sortSelect");
  var sortOrder = sortSelect.value;
  
  if (sortOrder === "") {
    // Nếu người dùng chọn "Sắp xếp theo giá", hiển thị danh sách ban đầu
    renderProductionList(originalProductList);
    
    // Sau khi sắp xếp xong, ẩn spinner và khôi phục nội dung
    hideSpinner();
    
    return;
  }
  
  if (sortOrder === "asc") {
    // Sắp xếp danh sách sản phẩm theo giá tăng dần
    sortedProducts = dssp.slice().sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceA - priceB;
    });
    console.log("🚀 ~ sortedProducts:", sortedProducts);
  }
  
  if (sortOrder === "desc") {
    // Sắp xếp danh sách sản phẩm theo giá giảm dần
    sortedProducts = dssp.slice().sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceB - priceA;
    });
  }
  // Gọi hàm để hiển thị danh sách sản phẩm đã được sắp xếp
  renderProductionList(sortedProducts);

  // Sau khi sắp xếp xong, ẩn spinner và khôi phục nội dung
  hideSpinner();
}
window.sortProducts = sortProducts;

