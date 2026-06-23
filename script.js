fetch('status.txt')
    .then(response => response.text())
    .then(data => {

        const lignes = data.split('\n');

        const alertes = document.getElementById('alertes');
        const serveurs = document.getElementById('serveurs');

        alertes.innerHTML = '';
        serveurs.innerHTML = '';

        lignes.forEach(ligne => {

            ligne = ligne.trim();

            if (!ligne) return;

            const index = ligne.lastIndexOf(':');

            if (index === -1) return;

            const nom = ligne.substring(0, index).trim();
            const etat = ligne.substring(index + 1).trim();

            const estEnErreur = Number(etat) !== 1;

            const div = document.createElement('div');
            div.className = 'server';

            div.innerHTML = `
                <span class="server-name">${nom}</span>
                <span class="status ${estEnErreur ? 'offline' : 'online'}">
                    ${estEnErreur ? 'Hors Service' : 'Fonctionnel'}
                </span>
            `;

            if (estEnErreur) {
                div.classList.add('error-server');
                alertes.appendChild(div);
            } else {
                serveurs.appendChild(div);
            }

        });

        if (alertes.children.length === 0) {
            alertes.innerHTML = `
                <div class="all-ok">
                    ✅ Tous les serveurs sont opérationnels
                </div>
            `;
        }

    })
    .catch(error => {

        console.error(error);

        document.getElementById('alertes').innerHTML = `
            <div class="critical-error">
                ❌ Impossible de charger le fichier status.txt
            </div>
        `;
    });
