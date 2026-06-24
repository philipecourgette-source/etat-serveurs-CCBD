fetch('status.txt?' + Date.now())
.then(response => response.text())
.then(data => {

    const lignes = data.split('\n');

    const alertes = document.getElementById('alertes');
    const serveurs = document.getElementById('serveurs');
    const resume = document.getElementById('resume');

    alertes.innerHTML = '';
    serveurs.innerHTML = '';

    let nbPannes = 0;

    lignes.forEach(ligne => {

        ligne = ligne.trim();

        if (!ligne) return;

        const morceaux = ligne.split(':');

        const nom = morceaux[0].trim();
        const etat = morceaux[1].trim();

        const estEnErreur = Number(etat) === 0;

        let datePanne = '';

        if (morceaux.length >= 4) {

            datePanne =
                morceaux[2].trim() + ':' +
                morceaux[3].trim();
        }

        const div = document.createElement('div');
        div.className = 'server';

        if (estEnErreur) {

            nbPannes++;

            let dureeHTML = '';

            if (datePanne) {

                const debut = new Date(datePanne.replace(' ', 'T'));
                const maintenant = new Date();

                const diff = maintenant - debut;

                const jours = Math.floor(diff / 86400000);
                const heures = Math.floor((diff % 86400000) / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);

                dureeHTML = `
                    <div class="panne-info">
                        Depuis : ${datePanne}<br>
                        Durée : ${jours} j ${heures} h ${minutes} min
                    </div>
                `;
            }

            div.innerHTML = `
                <div>
                    <div class="server-name">${nom}</div>
                    ${dureeHTML}
                </div>

                <span class="status offline">
                    Hors Service
                </span>
            `;

            div.classList.add('error-server');

            alertes.appendChild(div);

        } else {

            div.innerHTML = `
                <span class="server-name">${nom}</span>

                <span class="status online">
                    Fonctionnel
                </span>
            `;

            serveurs.appendChild(div);
        }

    });

    if (nbPannes > 0) {

        resume.innerHTML = `
            <div class="incident-banner">
                🚨 INCIDENT EN COURS - ${nbPannes} serveur(s) en panne
            </div>
        `;

    } else {

        resume.innerHTML = `
            <div class="all-ok">
                ✅ Tous les serveurs sont opérationnels
            </div>
        `;
    }

})
.catch(error => {

    console.error(error);

    document.getElementById('resume').innerHTML = `
        <div class="critical-error">
            ❌ Impossible de charger status.txt
        </div>
    `;
});
