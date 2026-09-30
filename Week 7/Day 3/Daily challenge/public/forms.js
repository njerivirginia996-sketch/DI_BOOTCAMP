document.querySelectorAll("form[data-form]").forEach((form) => {
    const button = form.querySelector("button[type=submit]");
    const message = form.querySelector(".message");
    const inputs = [...form.querySelectorAll("input")];

    function updateButton() {
        button.disabled = inputs.some((input) => !input.value.trim());
    }

    inputs.forEach((input) => input.addEventListener("input", updateButton));
    updateButton();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (button.disabled) return;
        button.disabled = true;
        message.textContent = "";
        message.classList.remove("success", "error");

        const values = Object.fromEntries(new FormData(form).entries());
        try {
            const response = await fetch(`/${form.dataset.form}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Request could not be completed.");

            message.textContent = form.dataset.form === "register"
                ? `${result.message} You can now sign in.`
                : `${result.message} Signed in as ${result.user.username}.`;
            message.classList.add("success");
            if (form.dataset.form === "register") form.reset();
        } catch (error) {
            message.textContent = error.message;
            message.classList.add("error");
        } finally {
            updateButton();
        }
    });
});
