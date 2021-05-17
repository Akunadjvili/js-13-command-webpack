function currentViewPortWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}

function currentPage() {
    const st = unescape(window.location.href);
    return st.substring(st.lastIndexOf('/') + 1, st.lastIndexOf('.')).toLocaleLowerCase();
}

export default { currentViewPortWidth, currentPage }