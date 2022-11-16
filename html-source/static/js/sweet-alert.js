
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

        const { value: formValues } = await Swal.fire({
            title: title,
            html:msg,
            backdrop: false,
            focusConfirm: false,
            showCancelButton: true,
            willOpen: () => {
                const elem = document.getElementById('reservation-dates2');
                const rangepicker = new DateRangePicker(elem, {
                    format: "yyyy-mm-dd",
                    showOnFocus: true
                });
            },
            preConfirm: () => {
                return [
                    document.getElementById('start_date').value,
                    document.getElementById('end_date').value
                ]
            },
            didOpen: () => {
                document.getElementById("start_date2").removeAttribute("disabled");
                document.getElementById("end_date2").removeAttribute("disabled");
            },
        })

        if (formValues) {
            Swal.fire(JSON.stringify(formValues))
        }
    }

    return {
        toast: toast,
        success: success,
        error: error,
        customModal: customModal,
    }
}