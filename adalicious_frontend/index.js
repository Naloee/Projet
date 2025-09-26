document.addEventListener("DOMContentLoaded", () => {
  const btnValider = document.getElementById("btn-valider");
  const input = document.getElementById("name");
  // const message = document.getElementById("message");
  

  btnValider.addEventListener("click", () => {
    const prenom = input.value.trim();
    if (!prenom) {
      // message.textContent = "Merci d'entrer un prénom 🙏";
    alert("Merci d'entrer un prénom 🙏");
      return;
    }
    window.location.href = `menu.html?prenom=${encodeURIComponent(prenom)}`;
  });
  

});
