import Swal from "sweetalert2";

export const txNotification = async (tx:string) => {
    Swal.fire({
        title:'Transaction succesful!',
        html:"<a href=https://explorer.solana.com/tx/"+tx+"?cluster=devnet>"+tx+"</a>",
        icon:'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: "#1D4ED8"
    });
}

export const errorNotification = async (error:string, msg:string) => {
    Swal.fire({
        icon: 'error',
        title: error,
        text: msg,
        confirmButtonText: 'Ok',
        confirmButtonColor: "#1D4ED8"
      })
}

export const loaderNotification = async () => {
    Swal.fire({
        title: 'Waiting for response...',
    });
    Swal.showLoading();
}