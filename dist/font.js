/**
 * Removes all CSS font classes and adds CSS font class .poppins. Stores it in local storage variable "font" and applies it to all HTML text elements
 */
export function resetFont() {
    let temp = localStorage.getItem("font");
    $("*").removeClass("poppins");
    $("*").removeClass("playfair");
    $("*").removeClass("aleo");
    localStorage.setItem("font", "poppins");
    $("*").addClass(temp);
}
