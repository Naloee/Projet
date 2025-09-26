document.addEventListener("DOMContentLoaded", () => {
  const commandesDiv = document.getElementById("commandes");

  async function loadCommandes() {
    try {
      const res = await fetch("/commandes");
      let commandes = await res.json();

      // On n'affiche que les commandes qui ne sont pas "Prête"
      commandes = commandes.filter(cmd => cmd.status !== "Prête");

      commandesDiv.innerHTML = "";

      if (!commandes.length) {
        commandesDiv.textContent = "Aucune commande pour le moment 🍽️";
        return;
      }

      commandes.forEach(cmd => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";

        div.innerHTML = `
          <strong>Commande #${cmd.id} - ${cmd.client}</strong><br>
          <span style="font-size:2em">${cmd.plats.map(p => p.image).join(", ")}</span><br>
          Plats: ${cmd.plats.map(p => p.plate).join(", ")}<br>
          Status: <span id="status-${cmd.id}">${cmd.status}</span><br>
          <button class="btn-status" data-id="${cmd.id}">Prête</button>
          <button class="btn-annuler" data-id="${cmd.id}">Annuler</button>
        `;

        commandesDiv.appendChild(div);
      });

      // Boutons “Mettre Prête”
      document.querySelectorAll(".btn-status").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const res = await fetch(`/commandes/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Prête" })
          });

          //  if (res.ok) {
          //    const updated = await res.json();
          //    document.getElementById(`status-${id}`).textContent = updated.status;
          //  }
          if (res.ok) {
            
            // On recharge la liste pour masquer la commande
            loadCommandes();
          }
        });
      });

      // Boutons “Annuler”
      document.querySelectorAll(".btn-annuler").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const res = await fetch(`/commandes/${id}`, { method: "DELETE" });
          if (res.ok) loadCommandes();
        });
      });

    } catch (err) {
      console.error(err);
      commandesDiv.textContent = "Erreur lors du chargement des commandes 😢";
    }
  }

  loadCommandes();
});
