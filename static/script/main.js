var currentTheme = ""
$(document).ready(function () {
    getPageTheme()
    setPageTheme(currentTheme)
})


function getPageTheme() {
    if (localStorage.getItem("theme") !== null) {
        currentTheme = localStorage.getItem("theme")
    } else {
        localStorage.setItem("theme", "light");
        currentTheme = "light"
    }
}

function setPageTheme(theme) {
    if (theme === 'light') {
        $(".theme-icon").removeClass("bi-sun").addClass("bi-moon")
    }
    else {
        $(".theme-icon").removeClass("bi-moon").addClass("bi-sun")
    }

    $("body").removeClass().addClass(currentTheme);
}


function changePageTheme() {

    if (currentTheme === 'light') {
        currentTheme = 'dark'
    }
    else {
        currentTheme = 'light'
    }
    localStorage.setItem('theme', currentTheme)
    setPageTheme(currentTheme)

}
