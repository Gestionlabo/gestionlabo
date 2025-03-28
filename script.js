// Données initiales du tableau (à remplacer par l'importation du CSV)
let data = [];
let filteredData = [];

document.addEventListener("DOMContentLoaded", function() {
    // Charger le fichier CSV au démarrage
    chargerCSV("data.csv");

    // Ajout de l'événement de recherche
    document.getElementById("searchInput").addEventListener("input", function(event) {
        const searchTerm = event.target.value.toLowerCase();
        
        // Filtrer les données en fonction du terme de recherche
        filteredData = data.filter(row => {
            return Object.values(row).some(value =>
                value.toString().toLowerCase().includes(searchTerm) // Vérifier si le terme est présent dans une des valeurs
            );
        });
        
        afficherTableau(); // Mettre à jour le tableau avec les données filtrées
    });
});

// Fonction pour charger le CSV
function chargerCSV(url) {
    Papa.parse(url, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            if (results.data.length === 0) {
                console.error("Aucune donnée trouvée dans le fichier CSV.");
                return;
            }
            data = results.data;
            filteredData = [...data]; // Initialiser filteredData avec toutes les données
            afficherTableau(); // Mettre à jour le tableau avec les données
        },
        error: function(error) {
            console.error("Erreur lors du chargement du fichier CSV:", error);
        }
    });
}

// Fonction pour afficher le tableau
function afficherTableau() {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");

    // Vider le contenu actuel du tableau
    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (filteredData.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 100;  // S'assurer que la cellule occupe toute la largeur du tableau
        td.textContent = "Aucune donnée trouvée";
        tr.appendChild(td);
        tableBody.appendChild(tr);
        return;
    }

    // Ajouter les en-têtes de colonne
    Object.keys(filteredData[0]).forEach((colonne, index) => {
        const th = document.createElement("th");
        th.textContent = colonne;
        th.onclick = () => trierColonne(index, colonne);
        if ([1, 2, 3, 5].includes(index)) {  // Appliquer le tri uniquement pour les colonnes 2, 3, 4, et 6
            th.setAttribute("data-sortable", "true");
        }
        tableHeader.appendChild(th);
    });

    // Ajouter les lignes de données
    filteredData.forEach(ligne => {
        const tr = document.createElement("tr");

        Object.entries(ligne).forEach(([colonne, valeur], index) => {
            const td = document.createElement("td");

            if (index === 6) {  // Vérifie si on est bien dans la colonne 8 (SGH)
                td.innerHTML = "";  
                const pictos = valeur.split(" ");  // Séparer plusieurs SGH

                pictos.forEach(picto => {
                    const img = document.createElement("img");
                    img.style.width = "45px"; 

                    switch (picto) {
                        case "SGH07":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/c/c3/GHS-pictogram-exclam.svg";
                            img.alt = "Pictogramme SGH07";
                            break;    
                        case "SGH04":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/6/6a/GHS-pictogram-bottle.svg";
                            img.alt = "Pictogramme SGH04";
                            break;
                        case "SGH01":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/GHS-pictogram-explos.svg/100px-GHS-pictogram-explos.svg.png";
                            img.alt = "Pictogramme SGH01";
                            break;
                        case "SGH02":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/GHS-pictogram-flamme.svg/100px-GHS-pictogram-flamme.svg.png";
                            img.alt = "Pictogramme SGH02";
                            break;
                        case "SGH03":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/GHS-pictogram-rondflam.svg/100px-GHS-pictogram-rondflam.svg.png";
                            img.alt = "Pictogramme SGH03";
                            break;
                        case "SGH05":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/GHS-pictogram-acid.svg/100px-GHS-pictogram-acid.svg.png";
                            img.alt = "Pictogramme SGH05";
                            break;
                        case "SGH06":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/GHS-pictogram-skull.svg/100px-GHS-pictogram-skull.svg.png";
                            img.alt = "Pictogramme SGH06";
                            break;
                        case "SGH08":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/GHS-pictogram-silhouette.svg/100px-GHS-pictogram-silhouette.svg.png";
                            img.alt = "Pictogramme SGH08";
                            break;
                        case "SGH09":
                            img.src = "https://upload.wikimedia.org/wikipedia/commons/b/b9/GHS-pictogram-pollu.svg?uselang=fr";
                            img.alt = "Pictogramme SGH09";
                            break;
                    }

                    if (img.src) { 
                        td.appendChild(img);
                        td.appendChild(document.createTextNode(" "));
                    }
                });

            } else {
                td.textContent = valeur;  
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}

// Fonction de tri des colonnes
let currentSortColumn = null;
let currentSortOrder = 'asc';

function trierColonne(index, colonne) {
    const direction = (currentSortColumn === colonne && currentSortOrder === 'asc') ? 'desc' : 'asc';
    currentSortColumn = colonne;
    currentSortOrder = direction;

    filteredData.sort((a, b) => {
        const valA = a[colonne];
        const valB = b[colonne];

        if (typeof valA === 'string') {
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return direction === 'asc' ? valA - valB : valB - valA;
        }
    });

    afficherTableau();
}
