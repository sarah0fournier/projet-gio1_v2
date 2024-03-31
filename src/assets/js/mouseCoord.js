import {projectionCode} from '../../assets/js/constante.js';


export default function initMouseCoord(map){
  /**
    * Ajouter fonctionnaliter de openlayer qui permet de visualiser les coordonnes de la souris en temps reel sur la map
    * @param {Object} map - Objet de la map 
    * 
  */

    const mousePositionControl = new ol.control.MousePosition({
      projection: projectionCode,
      coordinateFormat: ol.coordinate.createStringXY(2)
    })
    
  map.addControl(mousePositionControl)

}

