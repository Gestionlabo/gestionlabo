// URL du fichier Google Sheets en CSV
let googleSheetURL = "https://docs.google.com/spreadsheets/d/1NIf0WW4AQjA-7JXAQjjWo6RAxU0woHc0ECgl3ePAXaw/export?format=csv";

// Liste des pictogrammes SGH
const pictogrammes = {
    "SGH07": "https://upload.wikimedia.org/wikipedia/commons/c/c3/GHS-pictogram-exclam.svg",
    "SGH04": "https://upload.wikimedia.org/wikipedia/commons/6/6a/GHS-pictogram-bottle.svg",
    "SGH01": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/GHS-pictogram-explos.svg/100px-GHS-pictogram-explos.svg.png",
    "SGH02": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/GHS-pictogram-flamme.svg/100px-GHS-pictogram-flamme.svg.png",
    "SGH03": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/GHS-pictogram-rondflam.svg/100px-GHS-pictogram-rondflam.svg.png",
    "SGH05": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/GHS-pictogram-acid.svg/100px-GHS-pictogram-acid.svg.png",
    "SGH06": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/GHS-pictogram-skull.svg/100px-GHS-pictogram-skull.svg.png",
    "SGH08": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/GHS-pictogram-silhouette.svg/100px-GHS-pictogram-silhouette.svg.png",
    "SGH09": "https://upload.wikimedia.org/wikipedia/commons/b/b9/GHS-pictogram-pollu.svg?uselang=fr"
};

$(document).ready(function () {
    $.get(googleSheetURL, function (data) {
        let lignes = data.split("\n").map(l => l.split(","));
        let en_tetes = lignes[0];
        let contenu = lignes.slice(1);

        // Création de l'en-tête du tableau
        en_tetes.forEach(col => {
            $("#table-header").append(`<th>${col}</th>`);
        });

        // Création du contenu du tableau
        contenu.forEach(ligne => {
            let rowHTML = "<tr>";
            
            ligne.forEach((cell, index) => {
                if (index === 6) { // Si on est dans la colonne 7
                    let pictosHTML = "";
                    let codes = cell.split(" "); // Séparer les codes SGH par espace

                    codes.forEach(code => {
                        if (pictogrammes[code]) {
                            pictosHTML += `<img src="${pictogrammes[code]}" alt="Pictogramme ${code}" width="50" style="margin-right: 5px;">`;
                        }
                    });

                    rowHTML += `<td>${pictosHTML || cell}</td>`; // Affiche pictos ou texte si inconnu
                } else {
                    rowHTML += `<td>${cell}</td>`; // Affichage classique
                }
            });

            rowHTML += "</tr>";
            $("#tableau tbody").append(rowHTML);
        });

        // Initialiser DataTables avec pagination et surbrillance des lignes
        $('#tableau').DataTable({
            order: [[1, 'asc']], // Tri par défaut sur la 2ᵉ colonne
            columnDefs: [
                
                { orderable: false, targets: [4] }, // Désactiver le tri sur les colonnes 5 et 6 (index 4 et 5)
                { type: 'num', targets: [3, 5, 7, 8, 9] } // Activer le tri numérique pour les colonnes 4, 8, 9, 10 (index 3, 7, 8, 9)
            ],
            pageLength: 50 // Nombre d'éléments par page
        });
        
    });
});
