import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const toastSuccess = (title = 'Thành công') => {
  return Toast.fire({
    icon: 'success',
    title: title
  });
};

export const toastError = (title = 'Lỗi hệ thống!') => {
  return Toast.fire({
    icon: 'error',
    title: title
  });
};

export const toastInfo = (title = 'Thông báo') => {
  return Toast.fire({
    icon: 'info',
    title: title
  });
};

export const confirmDelete = async (text = 'Xác nhận dữ liệu sẽ bị xóa hoàn toàn khỏi hệ thống!', title = 'Xác nhận xóa?') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#8c8c8c',
    confirmButtonText: 'Xóa ngay',
    cancelButtonText: 'Hủy'
  });
  return result.isConfirmed;
};

export const confirmAction = async (title = 'Xác nhận?', text = 'Bạn có chắc chắn muốn thực hiện hành động này?') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#8c8c8c',
      confirmButtonText: 'Tiếp tục',
      cancelButtonText: 'Hủy'
    });
    return result.isConfirmed;
};
