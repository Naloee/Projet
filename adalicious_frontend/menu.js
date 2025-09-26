document.addEventListener("DOMContentLoaded", () => {
  const menuDiv = document.getElementById("menu");
  const welcome = document.getElementById("welcome");
  const btnCommander = document.getElementById("btn-commander");
  const btnCuisine = document.getElementById("btn-cuisine");

  // Récupère le prénom depuis l'URL
  const params = new URLSearchParams(window.location.search);
  const prenom = params.get("prenom") || "Invité";
  welcome.textContent = `Bonjour ${prenom} 👋`;

  let selection = [];

  async function loadMenu() {
    const res = await fetch("/menu");
    const data = await res.json();

    menuDiv.innerHTML = "";
    data.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `
        <span style="font-size:2em">${item.image}</span>
        <strong>${item.plate}</strong><br>
        ${item.description}<br>
        <button data-id="${item.id}">Commander</button>
        <hr>
      `;
      menuDiv.appendChild(div);

      div.querySelector("button").addEventListener("click", () => {
        selection.push(item);
        alert(`${item.plate} ajouté à votre sélection !`);
      });
    });
  }

  loadMenu();

  btnCommander.addEventListener("click", async () => {
    if (!selection.length) {
      alert("Sélectionnez au moins un plat !");
      return;
    }

    const res = await fetch("/commandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: prenom, plats: selection })
    });

    if (res.ok) {
      alert("Commande validée ✅");
      selection = [];
      loadMenu();
    } else {
      alert("Erreur lors de la commande 😢");
    }
  });

  btnCuisine.addEventListener("click", () => {
    window.location.href = "cuisine.html";
  });
});
