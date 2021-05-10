import InfoEventModalForm from '../components/InfoEventModalForm';
import fetchTeam from './fetchTeam';
import teamMarkUpTpl from '../../templates/dynamic/team.info.hbs';

const teamLinkRef = document.querySelector('.team-link');
const teamData =  fetchTeam().then((data) => teamMarkUpTpl(data));

const teamModal = new InfoEventModalForm({
    modal:'.js-modal',
    template: teamData,
})

console.log(teamModal.refs.modal)

teamLinkRef.addEventListener('click', onTeamModalOpen)

function onTeamModalOpen(){
  

    // teamModal.refs.modal

    
    teamModal.get(modalRef);
   


}