$(document).ready(function() {
    $(".container").on("change", ".tdo", function() {
        $(this).siblings(".todo-txt").find("p").toggleClass("striked");
    });
});