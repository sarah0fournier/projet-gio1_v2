import {BuildUrlApiGeoadmin, fetchDataFromURL, displayZoneRestrictionData } from './draw.js';

export function togglePopup(isPopup, map) {
    // Inversez l'état de la popup
    isPopup =!  isPopup
    console.log("new etat popup : ", isPopup)
    if (isPopup) {
        // Ajouter un gestionnaire d'événement au clic de la carte
        map.on('click', showPopup());
    } else {
        // Retirer le gestionnaire d'événement au clic de la carte
        map.un('click', showPopup());
    }
}

export function setCoord(coordinate, resultsPopup, layers){
    // Calculer les coordonnées des coins du rectangle
    var topLeft = [coordinate[0] - 2.5, coordinate[1] + 2.5];
    var topRight = [coordinate[0] + 2.5, coordinate[1] + 2.5];
    var bottomRight = [coordinate[0] + 2.5, coordinate[1] - 2.5];
    var bottomLeft = [coordinate[0] - 2.5, coordinate[1] - 2.5];

    // Formater les coordonnées pour la requête
    var rectangleCoordinates = [
        [topLeft, topRight, bottomRight, bottomLeft, topLeft] // Premier anneau du polygone
    ];

    console.log('Coordonnées du rectangle :', rectangleCoordinates);
                
    // Vider la liste de resultsPopup --> rinitialise a chaque clique
    resultsPopup = []
    // Parcourir chaques layers pour afficher les popups
    layers.forEach((layer, index) => {

        // Envoie requete url du layer, si layer est activer
        if(layer.getVisible()){
            var name_layer = layer.getSource().getParams().layers
            var url = BuildUrlApiGeoadmin(name_layer, rectangleCoordinates);

            // Appeler la fonction pour récupérer les données à partir de l'URL
            fetchDataFromURL(url)                
                .then(resultPopup => {
                    console.log('Ajouter les resultats de la requete url de la couche : ', name_layer)
                    resultsPopup.push({ name_layer: name_layer, data: resultPopup });
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données :', error);
                });
        }
    });
}

export function showPopup(event, popupCoordinates, popupVisible) {
    // Récupérer les coordonnées du clic
    popupCoordinates = event.coordinate;

    setCoord(popupCoordinates)

    // Etat popup devient visible car a qqch a mettre dans popup
    popupVisible = true ;

    // Afficher les coordonnées dans inspecteur pour test
    console.log(`Coordonnées du clic : Latitude = ${popupCoordinates[1]}, Longitude = ${popupCoordinates[0]}`);
}

export function closePopup(popupVisible) {
    // Quand appuie sur croix popup, elle se ferme
    popupVisible = false; // Mettre popupVisible à false pour pas afficher popup
}
