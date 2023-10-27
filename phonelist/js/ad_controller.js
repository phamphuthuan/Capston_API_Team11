function getDataForm(){
    var ten = document.getElementById("TenSP").value;
    var gia = document.getElementById("GiaSP").value;
    var hinhAnh = document.getElementById("HinhSP").value;
    var loai = document.getElementById("LoaiSP").value;
    var soLuong = document.getElementById("soLuongSP").value;
    return {
        name: ten,
        price: gia,
        img: hinhAnh,
        type: loai,
        quality: soLuong,
    };
}

function showDataForm(Products){
      // hiển thị thông tin lên form
      document.getElementById("TenSP").value = Products.name;
      document.getElementById("GiaSP").value = Products.price;
      document.getElementById("HinhSP").value = Products.img;
      document.getElementById("LoaiSP").value = Products.type;
      document.getElementById("soLuongSP").value = Products.quality;
}

// Hàm để đóng modal
function closeModal() {
    $("#myModal").modal("hide"); // Sử dụng jQuery để đóng modal
  }
  