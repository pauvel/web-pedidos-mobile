const axios = require('axios').default;


const getAllClients = async() => {
    const response = await axios.get('http://localhost:4000/client/make/all');
    const { data } = response;
    return data;
};

const getClientById = async( client ) => {
    const r = await axios.get(`http://localhost:4000/client/make/show/${client}`);
    const { data } = r;
    const { response } = data;
    return response.data;
};

module.exports = {
    getAllClients,
    getClientById
}