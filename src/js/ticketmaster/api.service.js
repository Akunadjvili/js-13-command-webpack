const ROUTER_URL = "https://group-13-backend.herokuapp.com/api/ticketmaster";
import { progress } from '@components/Progress';
import notify from '@components/notify.js';

async function fetchData(url) {
    const options = {
        method: 'GET',
        headers: { "Content-type": "application/json;charset=utf-8" },
    };
    try {
        const response = await fetch(`${ROUTER_URL}${url}`, options);
        const data = await response.json();
        // console.log("==", data);
        return data
    } catch (error) {
        progress.hide();
        notify.showError(error)
        return {}
    }
};

export default fetchData
