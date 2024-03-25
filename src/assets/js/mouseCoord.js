// NE PAS SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!
import {projectionCode} from '../../assets/js/constante.js';


export default function initMouseCoord(map){
    //--------------- Affichage coords sur map -----------------  
  const mousePositionControl = new ol.control.MousePosition({
      projection: projectionCode,
      coordinateFormat: ol.coordinate.createStringXY(2)
    })
    
  map.addControl(mousePositionControl)

}

