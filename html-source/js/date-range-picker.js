// Runs the Date Range Picker
const elem = document.getElementById('reservation-dates');
const rangepicker = new DateRangePicker(elem, {
    format: "yyyy-mm-dd",
});