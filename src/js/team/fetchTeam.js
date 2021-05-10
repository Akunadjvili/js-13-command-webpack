const TEAM_URL = 'https://group-13-backend.herokuapp.com/api/team';

export default async function fetchTeam() {
    const options = {
        method: 'GET',
        headers: { "Content-type": "application/json;charset=utf-8" },
    };
    try {
        const response = await fetch(TEAM_URL, options);
        const data = await response.json();
      
        return data
    } catch (error) {
        progress.hide();
        notify.showError(error)
        return {}
    }
};

