export function kiemTraRong(value,idErr) {
    if(value !="") {
        //ko lỗi
        document.getElementById(idErr).innerHTML = "";
        return true;
    }
    else {
        document.getElementById(idErr).innerHTML = "Vui lòng nhập đầy đủ thông tin";
        return false;
    }
}
window.kiemTraRong = kiemTraRong;

