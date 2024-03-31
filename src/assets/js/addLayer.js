import {projectionCode, wmsUrlGeoadmin, wmsUrlGeodienst, attributionUrlGeoadmin, attributionUrlGeodienst } from '../../assets/js/constante.js';

export function createLayer(name, layerName, attribution, wmsurl, attributionUrl, background = true ) {
    /**
   * Ajouter une couche a la map (actuellement fonctionne pour layer et non background)
   * 
   * @param {string} name - Nom a afficher de la couche eg. Zones géographiques UAS en Suisse
   * @param {string} layerName - Nom de la couche dans API eg. ch.bazl.einschraenkungen-drohnen
   * @param {string} attribution - Nom de la source attribution pour le copyright eg. "Zones géographiques UAS en Suisse / OFAC
   * @param {string} wmsurl - URL générale du WMS eg. https://wms.geo.admin.ch/
   * @param {string} attributionUrl - URL a afficher pour le copyright eg. https://www.geo.admin.ch/fr/home.html
   * @param {boolean} background-  Par defaut couche de fond de plan (permet par la suite avoir 1 fonction pour importer toute couche WMS)
   * @returns {ol.layer.Tile} - Une couche de tuiles OpenLayers
   * 
   */

    // Definir parametre affichage des couches
    var valueIndex, valueOpacity;
    if (background){
        valueIndex = -99 // Niveau arriere plan
        valueOpacity = 1 // Opaciter de la couche
    }   else {
        valueIndex = -98
        valueOpacity = 0.5
    }
        
    return new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: wmsurl,
            projection: projectionCode,
            params: { layers: layerName, name : name},
            attributions: [`&copy; <a href="${attributionUrl}">${attribution}</a>`]
        }),
        zIndex: valueIndex,
        opacity: valueOpacity,
    });
}


/**
 * Classe représentant une couche de fond OpenLayers basée sur les données GeoAdmin.
 * @class
*/

export class BackgroundLayerGeoAdmin {
    /**
     * Crée une nouvelle couche de BackgroundLayerGeoAdmin.
     * @constructor
     * @param {string} name - Le nom de la couche.
     * @param {string} layerName - Le nom de la couche pour le service WMS.
     * @param {string} attribution - L'attribution de la couche.
    */

    constructor(name, layerName, attribution) {
        /**
         * Le nom de la couche.
         * @type {string} 
        */
        this.name = name; 

        /**
         * Indique si la couche est visible.
         * Par defaut, la couche pas visible
         * @type {boolean}
         * @default false
        */
        this.visible = false; 

        /**
         * La couche OpenLayers.
         * @type {ol.layer.Tile}
        */
        this.layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: wmsUrlGeoadmin,
                projection: projectionCode,
                params: { layers: layerName },
                attributions: [`&copy; <a href="${attributionUrlGeoadmin}">${attribution}</a>`]
            }),
            zIndex: -99,
            opacity:  0.5,

        });
    }

    /**
     * Obtient la couche OpenLayers associée à cette couche.
     * @returns {ol.layer.Tile} - La couche OpenLayers.
    */
    getLayer() {
        return this.layer;
    }
}


/**
 * Classe représentant une couche de fond OpenLayers basée sur les données Geodienste.
 * @class
*/
// Classe pour definir les couches sur la map
export class BackgroundLayerGeodienste {
    /**
     * Crée une nouvelle instance de BackgroundLayerGeodienste.
     * @constructor
     * @param {string} name - Le nom de la couche.
     * @param {string} layerName - Le nom de la couche pour le service WMS.
     * @param {string} attribution - L'attribution de la couche.
    */
    constructor(name, layerName, attribution) {
        /**
         * Le nom de la couche.
         * @type {string}
        */
        this.name = name; 

        /**
         * Indique si la couche est visible.
         * Par defaut, la couche pas visible
         * @type {boolean}
         * @default false
        */
        this.visible = false; 

        /**
         * La couche OpenLayers.
         * @type {ol.layer.Tile}
        */
        this.layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: wmsUrlGeodienst,
                projection: projectionCode,
                params: { layers: layerName, 'TILED': true },
                attributions: [`&copy; <a href="${attributionUrlGeodienst}">${attribution}</a>`]
            }),
            zIndex: -99,
            opacity:  0.5,

        });
    }

     /**
      * Obtient la couche OpenLayers associée à cette couche.
      * @returns {ol.layer.Tile} - La couche OpenLayers.
     */
    getLayer() {
        return this.layer;
    }
}
