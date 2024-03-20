// NE PAS SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!

// Function pour definir une couche a ajouter sur la Map (actuellement fonctionne pour layer et non background)
export function createLayer(name, layerName, attribution, wmsurl, attributionUrl, background = true ) {
    // Par defaut background = True
        var valueIndex, valueOpacity;
        if (background){
            valueIndex = -99
            valueOpacity = 1
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


import {projectionCode, wmsUrlGeoadmin, wmsUrlGeodienst, attributionUrlGeoadmin, attributionUrlGeodienst } from '../../assets/js/constante.js';
// Classe pour definir les couches sur la map
export class BackgroundLayerGeoAdmin {
    constructor(name, layerName, attribution) {
        this.name = name; // Name couche
        this.visible = false; // Par defaut, la couche pas visible
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

    getLayer() {
        return this.layer;
    }
}

// Classe pour definir les couches sur la map
export class BackgroundLayerGeodienste {
    constructor(name, layerName, attribution) {
        this.name = name; // Name couche
        this.visible = false; // Par defaut, la couche pas visible
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

    getLayer() {
        return this.layer;
    }
}
