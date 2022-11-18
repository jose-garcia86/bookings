
function prompt () {
    let toast = function (c) {
        const {
            msg = "",
            icon = "success",
            position = "top-end"
        } = c;
        const Toast = Swal.mixin({
            toast: true,
            title: msg,
            position: position,
            icon: icon,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({})
    }

    let success = function (c) {
        const {
            title = "",
            msg = "",
            footer = "", // as HTML Text
        } = c
        Swal.fire({
            icon: 'success',
            title: title,
            text: msg,
            footer: footer
        })
    }

    let error = function (c) {
        const {
            title = "",
            msg = "",
            footer = "", // as HTML Text
        } = c
        Swal.fire({
            icon: 'error',
            title: title,
            text: msg,
            footer: footer
        })
    }

    async function customModal(c){
        const {
            title = "",
            msg = "",
        } = c;

        const { value: result } = await Swal.fire({
            title: title,
            html:msg,
            backdrop: false,
            focusConfirm: false,
            showCancelButton: true,
            willOpen: () => {
                if (c.willOpen !== undefined){
                    c.willOpen();
                }
            },
            preConfirm: () => {
                return [
                    document.getElementById('start_date').value,
                    document.getElementById('end_date').value
                ]
            },
            didOpen: () => {
              if(c.didOpen !== undefined){
                  c.didOpen();
              }
            },
        })

        if(result){
            if(result.dismiss !== Swal.DismissReason.cancel){
                if (result.value !== ""){
                    if(c.callback != undefined){
                        c.callback(result);
                    }
                } else{
                    c.callback(false);
                }
            } else {
                c.callback(false);
            }
        }
    }

    return {
        toast: toast,
        success: success,
        error: error,
        customModal: customModal,
    }
}