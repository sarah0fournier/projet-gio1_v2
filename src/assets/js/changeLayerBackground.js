   // Classe pour definir les couches sur la map
   class GeoAdminLayer {
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
        opacity: 1,
        zIndex: -98,

        });
    }

    getLayer() {
        return this.layer;
    }
}

