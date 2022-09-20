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

document.getElementById("sub-code").innerText = sub_id;

if (sem1.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 1";
    selectedSem = sem1;
    sly_index = 0;
}
else if (sem2.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 2";
    selectedSem = sem2;
    sly_index = 1;
}
else if (sem3.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 3";
    selectedSem = sem3;
    sly_index = 2;
}
else if (sem4.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 4";
    selectedSem = sem4;
    sly_index = 3;
}
else if (sem5.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 5";
    selectedSem = sem5;
    sly_index = 4;
}
else if (sem6.includes(sub_id)) {
    document.getElementById("sem-title").innerText = "Semester 6";
    selectedSem = sem6;
    sly_index = 5;
}
else {
    document.getElementById("sem-title").innerText = "Semester 1";
    selectedSem = sem1;
    sly_index = 0;
}



var notesData = {};
var notes_collec;
var notes_collec_object;

$.getJSON("https://raw.githubusercontent.com/Xbotics7/Nomtes/master/assets/nomtes7.json", function (data) {

    selectedSem.forEach(el => {

        if (el === sub_id) {
            document.getElementById("sub-drop-cont").innerHTML += ` <a class="dropdown-item active" href="./notes.html?id=${el}">
        
            ${data.BCA[el]["SubjectName"]}
            </a>`
        }
        else {
            document.getElementById("sub-drop-cont").innerHTML += ` <a class="dropdown-item" href="./notes.html?id=${el}">
            
            ${data.BCA[el]["SubjectName"]}
            </a>`
        }
    })



    notesData = data.BCA[sub_id]
    document.getElementById("notes-cont").innerHTML += ` <a class="notesBtn" id="notesPop" onclick="openNotes()" href="#">
    <i class="fa fa-sticky-note fa-lg mr-2"></i>
    Notes
    </a>`

    if (notesData["Akash_url"] !== "") {
        document.getElementById("notes-cont").innerHTML += ` <a class="notesBtn" href='${notesData["Akash_url"]}' target="_blank">
        <i class="fa fa-bookmark fa-lg mr-2"></i>
        Akash
        </a>`
    }
    if (notesData["Book_url"] !== "") {
        document.getElementById("notes-cont").innerHTML += ` <a class="notesBtn" href='${notesData["Book_url"]}' target="_blank">
        <i class="fa fa-book fa-lg mr-2"></i>
        Book
        </a>`
    }
    if (notesData["Paper_analysis_url"] !== "") {
        document.getElementById("notes-cont").innerHTML += ` <a class="notesBtn" href='${notesData["Paper_analysis_url"]}' target="_blank">
        <i class="fa fa-file-text-o fa-lg mr-2"></i>
        Paper Analysis
        </a>`
    }
    document.getElementById("notes-cont").innerHTML += ` <a class="notesBtn" onclick="openVideos()" href="#">
    <i class="fa fa-video-camera fa-lg mr-2"></i>
    Videos
    </a>`

    var res = notesData["SubjectName"].substr(0, 15);
    if (notesData["SubjectName"].length > 15)
        res = res + "..."
    document.getElementById("sub-title").innerText = res;
    notes_collec = notesData["Notes"]
    notes_collec_object = Object.keys(notes_collec);


    //Gettting Slyabus


})

$.getJSON("https://raw.githubusercontent.com/Xbotics7/bruh/main/course.json", function (data) {
    var semsly = data[0]["semester"][sly_index]

    var semsly_obj = Object.keys(semsly["subjects"]);

    for (i = 0; i < semsly_obj.length; i++) {

        var bruh = semsly["subjects"][semsly_obj[i]];

        var notes = Object.keys(bruh);

        var sly = bruh["syllabus"]

        var sly_obj = Object.keys(sly);

        if (bruh["paper_id"].toString() === course_code) {

            for (j = 0; j < sly_obj.length; j++) {

                var slynew = sly[sly_obj[j]];

                var title = slynew["title"]

                var chap = slynew["chapters"]

                document.getElementById("course-sly").innerHTML += ` <div class="sly-cont">
                <h2 class="sly-unit">
                    ${sly_obj[j].replace("_", "-")}
                </h2>
                <h3 class="sly-title">
                    ${title}
                </h3>
                <p class="sly-chap">
                    ${chap}
                </p>
            </div>`
            }
            return;
        }

    }
})

function openNotes() {

    if (notes_collec_object.length <= 1) {
        if (notes_collec[notes_collec_object[0]] !== "")
            window.open(notes_collec[notes_collec_object[0]]);
        else {
            $('.toast').toast('show')
        }
    }
    else {
        $('#notesModalCenter').modal({
            keyboard: false
        })
        document.getElementById("notes-pop-body").innerHTML = "";
        for (i = 0; i < notes_collec_object.length; i++) {
            document.getElementById("notes-pop-body").innerHTML += `<a class="notesPopBtn" href='${notes_collec[notes_collec_object[i]]}' target="_blank">
            <i class="fa fa-sticky-note fa-lg mr-2"></i>
            ${notes_collec_object[i]}
            </a>`
        }
    }

}

function openVideos() {
    window.open(location.href = 'vid.html?id=' + sub_id);
}


