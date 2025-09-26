
import express from "express";
// import data from "./data.json" with { type: "json" };
import path from "path";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config(); // charge les variable du env


const app = express();
const PORT =  process.env.PORT || 3000;

// Connexion à Neon avec SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requis pour Neon
  },
});



app.use(cors({ origin: "http://127.0.0.1:5500"}));
app.use(express.json());

const frontendPath = path.join(process.cwd(), "../adalicious_frontend");
app.use(express.static(frontendPath));

// let commandes = [];

// Menu routes
app.get("/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu ORDER BY id ASC");
    res.json(result.rows); // rows = propriété qui contients les résultats d'une requête SQL
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Erreur serveur"});
  }
})

app.get("/menu/:id", async(req, res) => {
  const id = Number(req.params.id);
  try{
    const result = await pool.query("SELECT * FROM menu WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({error: "Plat non trouvé" });
    res.json(result.rows[0])
  } catch (err){
    console.error(err)
    res.status(500).json({error: "Erreur serveur"});
  }
})

//   const plat = data.find(p => p.id === id);
//   if (!plat) return res.status(404).json({ error: "Plat non trouvé" });
//   res.json(plat);
// });


// Commandes routes
app.get("/commandes", async (req, res) => {
  try{
    const result = await pool.query("SELECT * FROM commandes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Erreur serveur"});
  }
});

  app.post("/commandes", async (req,res) =>{
    const { client, plats } = req.body;
  if (!client || !plats?.length) return res.status(400).json({ error: "Commande invalide" });

try {
    const result = await pool.query(
      "INSERT INTO commandes (client, plats) VALUES ($1, $2) RETURNING *",
      [client, JSON.stringify(plats)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.patch("/commandes/:id", async(req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!["En préparation","Prête"].includes(status)) 
    return res.status(400).json({ error: "Status invalide" });
  
  try{ 
    const result = await pool.query(
      "UPDATE commandes SET status=$1 Where id=$2 RETURNING *",
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({error : "Commande non trouvée"});
    res.json(result.rows[0]);
  } catch (err){
    console.error(err)
  res.status(500).json({error: "Erreur serveur"});
}
});

app.delete("/commandes/:id", async (req, res) => {
  const id = Number(req.params.id);
  try{
    const result = await pool.query("DELETE FROM commandes WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({error : "Commande non trouvée"});
    res.status(204).end()
  }catch (err){
    console.error(err);
    res.status(500).json({error : "Erreur serveur"});
  }
})

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:3000`));


// import express from "express";
// import data from "./data.json" with { type: "json" };
// const app = express();

// app.get("/", (req, res) => {  
// res.send("Accueil");
// });

// app.get("/menu", (req, res) => {    
// res.json(data);
// });


// app.get("/coucou", (req,res) =>{
//     res.send("Coucou")
// })


// app.get("/menu/:id", (req, res) => {  
//     const id = Number(req.params.id);  
//     const plat = data.find(p => p.id === id);  
//     if (!plat) return res.status(404).json({ error: `Plat id=${id} non trouvé` });  
//     res.json(plat);
//     });
    
    
// app.listen(3000, () => {  console.log("Serveur lancé sur http://localhost:3000");});

