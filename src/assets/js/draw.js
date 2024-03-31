export function BuildUrlApiGeoadmin(layer, polygonCoordinates) {
    /**
     * Construit l'URL de requête vers le serveur API Map GeoAdmin.
     * @param {string} layer - Le calque à interroger.
     * @param {Array} polygonCoordinates - Les coordonnées du polygone à interroger.
     * @returns {string} L'URL de requête construite.
    */

    var url = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometryType=esriGeometryPolygon&geometry=" + encodeURIComponent(JSON.stringify({ "rings": polygonCoordinates })) + "&layers=all:" + encodeURIComponent(layer) + "&geometryFormat=geojson&sr=2056&tolerance=0";
    //console.log("URL de la requête:", url);
    return url
}

export function fetchDataFromURL(url) {
    /**
     * Envoie une requête à l'URL spécifiée et récupère les données.
     * @param {string} url - L'URL de la requête.
     * @returns {Promise} Une promesse résolue avec les données récupérées.
    */

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json(); // Si la réponse est OK, retournez les données JSON
            } else {
                throw new Error('Erreur lors de la requête')
            }
        })
        .then(data => {
            // Appel de la fonction pour afficher les données des zones de vol restreintes --> resulterat formater
            var listZonesData = displayZoneRestrictionData(data.results)
            // console.log('Resultat des zones formatter : ', listZonesData)
            return listZonesData
        })
        .catch(error => {
            console.error('Erreur :', error)
        })
}

export function displayZoneRestrictionData(results) {
    /**
     * Affiche les données des zones de vol restreintes de la couche ch.bazl.einschraenkungen-drohnen de map.geo.admin.
     * @param {Array} results - Les résultats de la requête.
     * @returns {Array} Les données des zones de vol restreintes.
    */

    // Variable pour stocker les données des zones de vol restreintes
    var zonesData = []

    // Parcours du tableau "results"
    results.forEach(function(result) {
        // Création d'un objet contenant les attributs spécifiés
        var zoneData = {
            zone_name_fr: result.properties.zone_name_fr,
            zone_restriction_fr: result.properties.zone_restriction_fr,
            zone_message_fr: result.properties.zone_message_fr,
            auth_url_fr: result.properties.auth_url_fr,
            auth_name_fr: result.properties.auth_name_fr,
            auth_contact: result.properties.auth_contact,
            auth_service_fr: result.properties.auth_service_fr,
            auth_email: result.properties.auth_email,
            auth_phone: result.properties.auth_phone
        }

        // Ajout de l'objet au tableau
        zonesData.push(zoneData)
    })
    return zonesData;
}