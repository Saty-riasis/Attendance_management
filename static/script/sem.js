let params = (new URL(document.location)).searchParams;
let sub_id = params.get("id");
console.log(sub_id);

if (sub_id == "BBA") {
    document.getElementById("CourseName").innerText = "Bachelor Of Business Administration";
}

function zoomsite() {
    window.open("https://zoomquilt.org/");
}