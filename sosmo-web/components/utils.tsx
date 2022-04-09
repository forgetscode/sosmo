import Swal from "sweetalert2";

export const txnotification = async (tx:string) => {
    const element= document.createElement('div')
    const prep = "https://solscan.io/tx/"+tx+"?cluster=devnet"
    element.innerHTML = "<a href="+prep+">"+tx+"</a>"
    Swal.fire(
        'Transaction succesful!',
         element as any,
        'success',
    );
}