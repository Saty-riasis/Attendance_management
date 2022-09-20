var sem1 = ["BCA 101", "BCA 103", "BCA 105", "BCA 107", "BCA 109"];
var sem2 = ["BCA 102", "BCA 104", "BCA 106", "BCA 108", "BCA 110"];
var sem3 = ["BCA 201", "BCA 203", "BCA 205", "BCA 207", "BCA 209"];
var sem4 = ["BCA 202", "BCA 204", "BCA 206", "BCA 208", "BCA 210"];
var sem5 = ["BCA 301", "BCA 303", "BCA 305", "BCA 307", "BCA 309", "BCA 311", "BCA 313", "BCA 315"];
var sem6 = ["BCA 302", "BCA 304", "BCA 306", "BCA 308", "BCA 310", "BCA 312", "BCA 314", "BCA 316"];

let params = (new URL(document.location)).searchParams;
let sub_id = params.get("id");
if (sub_id === null)
    sub_id = "BCA 101"
var selectedSem = [];
var sly_index = 0;
var course_code = sub_id.replace("BCA ", "20")


if (sem1.includes(sub_id)) {
    selectedSem = sem1;
    sly_index = 0;
}
else if (sem2.includes(sub_id)) {
    selectedSem = sem2;
    sly_index = 1;
}
else if (sem3.includes(sub_id)) {
    selectedSem = sem3;
    sly_index = 2;
}
else if (sem4.includes(sub_id)) {
    selectedSem = sem4;
    sly_index = 3;
}
else if (sem5.includes(sub_id)) {
    selectedSem = sem5;
    sly_index = 4;
}
else if (sem6.includes(sub_id)) {
    selectedSem = sem6;
    sly_index = 5;
}
else {
    selectedSem = sem1;
    sly_index = 0;
}



var notesData = {};
var vid_collec;
var vid_collec_object;

$.getJSON("https://raw.githubusercontent.com/Xbotics7/Nomtes/master/assets/nomtes7.json", function (data) {

    notesData = data.BCA[sub_id]

    vid_collec = notesData["Youtube"]
    if (vid_collec !== null && vid_collec !== undefined) {
        vid_collec_object = Object.keys(vid_collec);
        getVids()
    }
    else
        $(".not-available").removeClass("d-none").addClass("d-flex")


})


function getVids() {
    document.getElementById("vid-list-cont").innerHTML = "";

    if (vid_collec_object.length <= 0) {
        $(".not-available").removeClass("d-none").addClass("d-flex")
    } else {
        $(".not-available").removeClass("d-flex").addClass("d-none")
    }

    for (i = 0; i < vid_collec_object.length; i++) {
        document.getElementById("vid-list-cont").innerHTML += `<a class="vidBtn" href='#' onclick='openVid("${vid_collec[vid_collec_object[i]]}", "${vid_collec_object[i]}")'>
            <i class="fa fa-vid fa-lg mr-2"></i>
            ${vid_collec_object[i]}
            </a>`
    }
}

function youtube_playlist_parser(url) {

    var reg = new RegExp("[&?]list=([a-z0-9_]+)", "i");
    var match = reg.exec(url);

    if (match && match[1].length > 0) {
        return match[1];
    } else {
        return "";
    }

}

function openVid(vid_url, title, obj) {

    document.getElementById("vid-title").innerText = title;

    document.getElementById("vid-frame").innerHTML = `
    <iframe width="90%" height="415" src="https://www.youtube.com/embed/videoseries?list=${youtube_playlist_parser(vid_url)}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

    return false;
}


