import teamMarkUpTpl from '@templates/dynamic/team.info.hbs';
import TeamModalForm from '@components/TeamModalForm'

const teamLinkRef = document.querySelector('.team-link');
teamLinkRef.addEventListener('click', openFormHandler);

async function openFormHandler(event) {
    event.preventDefault();
    const modal = new TeamModalForm({
        modal: '.js-modal',
        template: teamMarkUpTpl,
    })
    await modal.show.bind(modal)();
}