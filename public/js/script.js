// Toggle password visibility
function togglePassword(fieldId, buttonId) {
    var password = document.getElementById(fieldId);
    var toggleBtn = document.getElementById(buttonId);
    
    if (password.type === "password") {
        password.type = "text";
        toggleBtn.textContent = "Hide";
    } else {
        password.type = "password";
        toggleBtn.textContent = "Show";
    }
}