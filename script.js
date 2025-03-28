let data = [];
let filteredData = [];
let sortColumn = null;
let sortAscending = true;

const csvUrl = "https://raw.githubusercontent.com/Gestionlabo/gestionlabo/refs/heads/main/data.csv";

function chargerCSV() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                delimiter: ";",
                header: true,
                complete: function(result) {
                    data = result.data;
                    filteredData = [...data];
                    afficherTableau();
                }
            });
        })
        .catch(error => console.error('Erreur de chargement CSV:', error));
}

function afficherTableau() {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");

    tableHeader.innerHTML = "";
    tableBody.innerHTML = "";

    if (filteredData.length === 0) return;

    Object.keys(filteredData[0]).forEach((colonne, index) => {
        const th = document.createElement("th");
        th.textContent = colonne;

        // Ajouter un attribut data-sortable pour les colonnes triables (2, 3, 4, 6)
        if (index === 1 || index === 2 || index === 3 || index === 5) {
            th.setAttribute("data-sortable", "true");
            th.onclick = () => trierColonne(index, colonne);
        }

        tableHeader.appendChild(th);
    });

    filteredData.forEach(ligne => {
        const tr = document.createElement("tr");

        Object.entries(ligne).forEach(([colonne, valeur], index) => {
            const td = document.createElement("td");

            if (index === 6) {
                td.innerHTML = "";
                const pictos = valeur.split(" ");

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

    function trierColonne(index, colonne) {
        // Limiter le tri aux colonnes 2, 3, 4, et 6 (index 1, 2, 3, et 5)
        if (![1, 2, 3, 5].includes(index)) return;
    
        // Supprime les classes de tri des autres colonnes
        document.querySelectorAll("th").forEach(th => {
            th.classList.remove("sorted-asc", "sorted-desc");
        });
    
        // Définir l'ordre de tri
        if (sortColumn === colonne) {
            sortAscending = !sortAscending; // Inverser le tri si on reclique
        } else {
            sortColumn = colonne;
            sortAscending = true;
        }
    
        filteredData.sort((a, b) => {
            let valA = a[colonne] || "";
            let valB = b[colonne] || "";
    
            if (index === 0) {
                const ordre = { "Solide": 0, "Liquide": 1 };
                return (ordre[valA] - ordre[valB]) * (sortAscending ? 1 : -1);
            }
    
            if (index === 1 || index === 2) {
                return valA.localeCompare(valB) * (sortAscending ? 1 : -1);
            }
    
            if (index === 3 || index === 5) {
                return (parseFloat(valA) - parseFloat(valB)) * (sortAscending ? 1 : -1);
            }
    
            return valA.localeCompare(valB) * (sortAscending ? 1 : -1);
        });
    
        // Appliquer la classe de tri à la colonne cliquée
        const th = document.querySelectorAll("th")[index];
        th.classList.add(sortAscending ? "sorted-asc" : "sorted-desc");
    
        afficherTableau();
    }
    

document.getElementById("searchInput").addEventListener("input", function(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredData = data.filter(row => 
        Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm))
    );
    afficherTableau();
});

window.onload = chargerCSV;
