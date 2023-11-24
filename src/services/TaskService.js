import axios from "axios";

function initInstance() {
    const binId = localStorage.getItem('binId');
    const apiKey = localStorage.getItem('apiKey');

    return axios.create({
        baseURL: 'https://api.jsonbin.io/v3/b/' + binId,
        headers: { 'X-Master-Key': apiKey }
    })
};

// Récupération des tâches
export async function getAll() {
    const instance = initInstance();
    const res = await instance.get('/latest');
    return res.data.record;
}

// Mise à jour des tâches 
export async function updateAll(newTasks) {
    const instance = initInstance();
    const res = await instance.put('/', newTasks);
}