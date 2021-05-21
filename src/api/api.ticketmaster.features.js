import ticketmaster from "@scripts/api/api.ticketmaster.service"
import ticketmasterv2 from "@scripts/api/api.ticketmaster.service.v2"
import { progress } from '@components/spinner.progress';

export async function eventById(id) {
    progress.show();
    const data = await ticketmaster(`/id=${id}`)
    progress.hide();
    return data;
}

export async function eventsByAuthor(list) {
    progress.show();
    const data = await Promise.all(list.map(id => ticketmasterv2(`/${id}`)))
    progress.hide();
    return data
}

export async function randomEventByPage(page, size = 20) {
    progress.show();
    const data = await ticketmaster(`/size=${size}&page=${page}`)
    progress.hide();
    return data
}

export async function eventsByIds(list) {
    progress.show();
    const data = await Promise.all(list.map(id => ticketmaster(`/id=${id}`)))
    progress.hide();
    return data
}

export async function eventSearchByPage(page, query, country, size = 20) {
    const countryCode = country ? `&countryCode=${country}` : '';
    const queryLine = query ? `&keyword=${encodeURIComponent(query)}` : '';
    // console.log("==", queryLine);
    progress.show();
    //&source=ticketmaster &source=ticketmaster
    const data = await ticketmaster(`/size=${size}&page=${page}${countryCode}${queryLine}`)
    progress.hide();
    return data
}