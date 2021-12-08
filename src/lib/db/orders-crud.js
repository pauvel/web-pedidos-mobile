const axios = require('axios').default;

const getOnAprovalOrders = async () => {
    const response = await axios.get('http://localhost:4000/orders_manage/show/on_aprobation');
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getAprovedOrders = async () => {
    const response = await axios.get('http://localhost:4000/orders_manage/show/aproved');
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getDoneOrders = async () => {
    const response = await axios.get('http://localhost:4000/orders_manage/show/done');
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getDoneOrdersByDate = async (from, to) => {
    const response = await axios.post('http://localhost:4000/orders/get_done_by_date', { from, to });
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getReadyOrders = async () => {
    const response = await axios.get('http://localhost:4000/orders_manage/show/ready');
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getCancellatedOrders = async () => {
    const response = await axios.get('http://localhost:4000/orders_manage/show/cancellated');
    const { data } = response;
    // r: order{}
    return data.orders;
}

const getOrderDetails = async ( order, client ) => {
    const response = await axios.get(`http://localhost:4000/client/make/show/order_details/${client}/${order}`);
    const { data } = response;
    // r: order{}, order_products{}
    return data;
}

const aproveOrder = async ( order ) => {
    const response = await axios.put('http://localhost:4000/orders_manage/set/aprove', { id: order });
    const { data } = response;
    return data;
}

const setReadyOrder = async ( order ) => {
    const response = await axios.put('http://localhost:4000/orders_manage/set/ready', { id: order });
    const { data } = response;
    return data;
}

const setDoneOrder = async ( order ) => {
    const response = await axios.put('http://localhost:4000/orders_manage/set/done', { id: order });
    const { data } = response;
    return data;
}

const cancelOrder = async ( order ) => {
    const response = await axios.put('http://localhost:4000/orders_manage/set/cancel', { id: order });
    const { data } = response;
    return data;
}

module.exports = {
    getOnAprovalOrders,
    getOrderDetails,
    getAprovedOrders,
    getReadyOrders,
    getCancellatedOrders,
    getDoneOrders,
    aproveOrder,
    setReadyOrder,
    setDoneOrder,
    cancelOrder,
    getDoneOrdersByDate
}