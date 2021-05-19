import ticketmaster from "@scripts/api/api.ticketmaster.service"
import { progress } from '@components/spinner.progress';

export async function eventById(id) {
    progress.show();
    const data = await ticketmaster(`/id=${id}`)
    progress.hide();
    return data;
}

export async function eventByAuthor(page, query, country, size = 20) {
    progress.show();
    console.log(`/${query}`);
    const data = await ticketmaster(`/id=${query}`)
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
    const data = await Promise.all(list.map(id => ticketmaster(`/id=${id}`)))
    progress.hide();
    return data
}

export async function eventSearchByPage(page, query, country, size = 20) {
    const countryCode = country ? `&countryCode=${country}` : '';
    const queryLine = query ? `&keyword=${encodeURIComponent(query)}` : '';
    progress.show();
    //&source=universe
    const data = await ticketmaster(`/size=${size}&page=${page}${countryCode}${queryLine}`)
    progress.hide();
    return data
}