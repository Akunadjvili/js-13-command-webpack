import ticketmaster from "@scripts/ticketmaster/api.service"
import { progress } from '@components/Progress';

export async function eventById(id) {
    progress.show();
    const data = await ticketmaster(`/id=${id}&source=universe`)
    progress.hide();
    return data;
}

export async function randomEventByPage(page, size = 20) {
    progress.show();
    const data = await ticketmaster(`/size=${size}&page=${page}`)
    progress.hide();
    return data
}

export async function eventsByIds(list) {
    progress.show();
    const data = await Promise.all(list.map(id => ticketmaster(`/id=${id}&source=universe`)))
    progress.hide();
    return data
}

export async function eventSearchByPage(page, query, country, size = 20) {
    const countryCode = country ? `&countryCode=${country}` : '';
    const queryLine = query ? `&keyword=${encodeURIComponent(query)}` : '';
    progress.show();
    const data = await ticketmaster(`/size=${size}&page=${page}&source=universe${countryCode}${queryLine}`)
    progress.hide();
    return data
}