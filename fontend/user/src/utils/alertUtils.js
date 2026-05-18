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

export const confirmDelete = async (text = 'Bạn không thể hoàn tác thao tác này!', title = 'Xác nhận xóa?') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#9ca3af',
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Đóng'
  });
  return result.isConfirmed;
};

export const confirmAction = async (title = 'Xác nhận?', text = 'Bạn có chắc chắn?') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy'
    });
    return result.isConfirmed;
};
