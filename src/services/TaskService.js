import axios from "axios";

const JSON_BIN_SECRET = import.meta.env.VITE_JSON_BIN_SECRET;

const instance = axios.create({
    baseURL: 'https://api.jsonbin.io/v3/b/6519999854105e766fbc508d',
    headers: { 'X-Master-Key': JSON_BIN_SECRET }
})

// Récupération des tâches
export async function getAll() {
    const res = await instance.get('/latest');
    return res.data.record;
}

// Mise à jour des tâches 
export async function updateAll(newTasks) {
    const rest = await instance.put('/', newTasks);
}