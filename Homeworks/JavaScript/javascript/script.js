const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/;
const postalCodePattern = /^[0-9]{5}-[0-9]{4}$|^[0-9]{4}$/;
const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

let button = document.getElementById("register-btn")
let resetButton = document.getElementById("reset-btn");

function hideFromPreviousTry() {
    let messageContainer = document.getElementById("message-container");
    if (!messageContainer.hasAttribute("hidden")) {
        messageContainer.setAttribute("hidden","");
    }
}

function createObjectForUser() {
    
    let user = new Object();
    user.username = document.getElementById("username").value.trim();
    user.name = document.getElementById("name").value.trim();
    user.familyName = document.getElementById("family-name").value.trim();
    user.email = document.getElementById("email").value.trim();
    user.password = document.getElementById("password").value.trim();
    user.street = document.getElementById("street").value.trim();
    user.city = document.getElementById("city").value.trim();
    user.postalCode = document.getElementById("postal-code").value.trim();
    return user;
}

function validateUser(user) {

    let usernameLength = user.username.length;
    let passwordLength = user.password.length;
    if (usernameLength < 3 || usernameLength > 10) {
        return {status: "error", message: "Потребителското име не е с правилната дължина - между 3 и 10 символа"};
    } else if (user.name.length > 50) {
        return {status: "error", message: "Името е прекалено дълго - над 50 символа"};
    } else if (user.familyName.length > 50) {
        return {status: "error", message: "Фамилията е прекалено дълга - над 50 символа"};
    } else if (!emailPattern.test(user.email)) {
        return {status: "error", message: "Невалиден имейл, опитайте с друг"};
    } else if (passwordLength < 6 || passwordLength > 10 || !passwordPattern.test(user.password)) {
        return {status: "error", message: "Паролата не е с правилната дължина – от 6 до 10 символа или не съдържа изискваните символи"};
    } else if (user.postalCode !== "" && !postalCodePattern.test(user.postalCode)) {
        return {status: "error", message: "Пощенския код не отговаря на формата"};
    } else {
        return {status: "ok"};
    }
}

function showMessage(text, isError) {
    const messageContainer = document.getElementById("message-container");
    const messageHeader = document.getElementById("message");
    messageHeader.textContent = text;
    if (isError) {
        messageHeader.classList.add("error");
    } else {
        messageHeader.classList.remove("error");
    }
    messageContainer.removeAttribute("hidden");
}

button.addEventListener("click", async () => {
    hideFromPreviousTry();
    let user = createObjectForUser();
    let validation = validateUser(user);
    if (validation.status === "ok") {

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const existingUsers = await response.json();

        let userExists = false;
        for (const u of existingUsers) {
            if (u.username.toLowerCase() === user.username.toLowerCase()) {
                userExists = true;
                break;
            }
        }

        if (userExists) {
            showMessage("Потребител с това потребителско име вече съществува.", true);
            return;
        }

        const postResponse = await fetch("https://jsonplaceholder.typicode.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                name: `${user.name} ${user.familyName}`,
                email: user.email,
                address: {
                    street: user.street,
                    city: user.city,
                    zipcode: user.postalCode,
                },
            }),
        });

        if (postResponse.ok) {
            let form = document.getElementById("registration-form");
            form.classList.remove("flex");
            form.setAttribute("hidden", "");
            document.querySelector(".page-header").setAttribute("hidden", "");
            let successContainer = document.getElementById("correct-registration-container");
            successContainer.classList.add("flex");
            successContainer.removeAttribute("hidden");
        } else {
            showMessage("Възникна грешка при регистрацията. Опитайте отново.", true);
        }
    } catch (error) {
        showMessage("Грешка при свързване със сървъра. Опитайте отново.", true);
    }

    } else if (validation.status === "error") {
        showMessage(validation.message, true);
        return;
    }
});

resetButton.addEventListener("click", () => {
    document.querySelector(".page-header").removeAttribute("hidden");
    let form = document.getElementById("registration-form");
    form.classList.add("flex");
    form.removeAttribute("hidden");
    let successContainer = document.getElementById("correct-registration-container");
    successContainer.classList.remove("flex");
    successContainer.setAttribute("hidden", "");
    document.getElementById("registration-form").reset();
});