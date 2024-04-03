# Restriction drone - CH

## Contexte 
Ce projet d'application web a été effectué dans le cours GIO1 du cursus de master MDT de la HES-SO.
Il porte avant tout un but éducatif permettant l'utilisation des nouveaux outils tel que Git, Github, Vue.js, etc. 

La législation concernant le vol de drone a changé au 1er janvier de cette année et un certain nombre de nouvelles règles sont entrées en vigueur. 
L'idée était donc de proposer un site web permettant à l'utilisateur de rentrer la zone de son plan de vol et quelques informations comme la hauteur de vol, afin de connaître automatiquement les restrictions locales.  
Ce sujet a été proposé le Professeur Adrien Gressin à la HEIG-VD.  
Il a été développé par Mesdames Sarah Fournier et Noémie Görisch, étudiantes au MDT.  
Les Professeurs encadrants sont Messieurs Olivier Lemer et Jens Ingensand.  

## Déroulement du projet
Ce projet a été réalisé en 7 semaines au cours du demi-semestre de cours.  
Il a donc été réalisé en parralèle des cours, ce qui a considérablement complexsifié la réalisation du projet car les outils étaient découvert en cour de projet.  
Ce point a toute son importance pour la suite. 

### Répartition des tâches
Ce projet a été réalisé en 2 temps importants 
1. Le développement sans Vue.JS  
   Pour ce point, Mme Görisch a consacré beaucoup de temps, notamment en dévloppant les fonctionnalité de :
   - Tracer de la zone de vol
   - Requête vers l'API GeoAdmin (pour l'activation des couches et l'intersection) 
   - Activation des couches et des fonds de cartes
     
   Mme Fournier a quant à elle développé :
   - La partie du formulaire
   - La barre de recherche (avec typeahead.js)
   - L'esthétique générale
     
2. Le développement avec Vue.JS
   Suite aux cours donnés au sujet de Vue.JS, tous le projet a été "migré".  
   Le travail de Mme Fournier a été titanesque, et a consisté a migré et développé les fonctionnalités de :
   - Activation des couches et des fonds de cartes
   - Tracer de la zone de vol
   - La partie du formulaire
   - Popup
   - L'esthétique générale
     
   Mme Görisch a développé :
   - L'affichage du tableau de résultats
   - La barre de recherche

   L'entraide a été un point central, et cela a été bénéfique, notamment pour trouver des petite erreur syntaxique bêtes.
   
### Problèmes rencontrés
La migration à 3 semaines de la fin du projet a été un travail long et très prise tête.  
Nous avons essayé de récupérer un maximum les scricts JS utilisés lors du développement sans JS.  
Cela a demandé souvent des améliorations voir de recommencer à zéros.

Notammnent pour l'outils de recherche, rien n'a été récupéré de la première version. C'est pourquoi cet outil n'est pas aboutit, il manque par exemple l'autocomplétion implémentée dans la première version. 


*Autre exemple Sarah de fonctionnalité qui étaient mieux avant ?  SF A NG : Perso j'en vois pas. Je crois que tout a été repris sauf pour l outil de recherche. Après niveau migration il y a un grand mixte entre reprise des fonctions js et de la nouveauté).
La première version du code se trouve donc ici (branche ? zip? au repo??*


## Etat actuel

### Fonctionnalités implémentées
- La barre de recherche pour zoomer sur la carte sur le lieu
- Le formulaire :
   - Champs pour la hauteur de vol
   - Liste déroulante pour le poids
   - Bouton de dessin pour la zone de vol
   - Bouton pour soumettre : permet d'afficher le tableau de resultats d'intersection avec les restrictions
   - Bouton pour réinitialiser le formulaire : permet de fermer le tableau, d'effacer la forme dessinée, et de vider le formulaire
- Des checkbox pour activer les couches à afficher 
- Une carte sur laquelle il est possible de dessiner la zone de vol
- Un onglet pour choisir les fonds de carte 
- Un bouton Popup : qui permet de cliquer sur la carte et d'obtenir les infos de l'objet cliqué.  
  Seul le parsage des infos de la couche de restriction des drones a été implémentée.
  Si la couche n'est pas affichée sur la carte, la couche n'est pas intérogée.
- Un tableau de résultats : s'affiche lors de la soumission du formulaire.  
  Il n'affiche que les résulats pour la couche de restrictions des drones, que celle-ci soit activée ou non. 

### Composant Vue
*A finir avec image* 

## Etat idéal
### Implémentation à corriger 
* A finir*

### Fonctionalités à implémenter
Celles-ci n'ont pas été implémenter par manque de temps principalement.  
Elles concernent : 
#### Pour la barre de recherche 
- L'autocomplétion (implémenté dans la première version du code) 
- Mieux gérer le zoom sur la carte
- Eventuellelemt mettre une épingle sur l'objet rechercher (implémenté dans la première version du code)
- La recherche par coordonnées (implémenté dans la première version du code)

  #### Pour le formulaire
- Gestion des informations remplies :
   - En affichant un autre tableau de resultat avec les restrictios en fontion de la hauteur et du poids
   - En calculant s'il y a des intersection avec le MNS ou les objets pouvant géner la circulation aérienne, etc.
   - En renvoyant l'utilisateur vers le site internet des restrictions
     *lien à mettre*
 - En inttroduisant d'autre informations comme :
   - Le permis que l'on dispose
   - Le nombre de personne estimées que l'on survole
   - Le jours et l'heure 
     
#### Pour la partie des couches à activer 
- D'autres couches comme
     - *A remplir*
- La possiblilité d'avoir de la transparence sur la couche activée
- Bouton pour observer les méta données de la couche
- Légende des couleurs et symboles par couches
  
#### Pour la carte 
- Importation et exportation de la zone de vol
- Modification de la zone de vol sans tout remplir le formulair à chaque fois
- Divers fonctionnalité notamment pour pouvoir facilement se déplacer sur la carte

#### Pour l'onglet pour la gestion des fonds de carte 
- Gestion de la transparence

#### Pour les popup
- Le parsage des autres couches
- Le retour d'information géographique (coordonnées, altitude sur MNT et MNA, etc.)
- Gestion de la taille du popup
- 
#### Pour le tableau de resultats 
*A finir*

# A trier 

This is a basic starter project for a Vuejs 3.0 app (via vue-cli). 
It includes :
- vuejs: 3.2
    - vue-router
    - axios
- cesium: 1.85
- leaflet: 1.7.1
- Openlayers: 6.9.0

## Installation

First download the project with Git:

```
git clone https://github.com/thibaud-c/seed-vuejs3.0-carto2D-3D.git your_project_name
```

Then open the folder in your command line, and install the needed dependencies:

```
cd your_project_name
npm install
```

Finally create a file .env at your project root to provide your Cesium ion key:

<sup>_an example of .env is provided in .env.example_</sup>
```js
VUE_APP_CESIUM_ION_TOKEN=YOUR_CESIUM_ION_KEY
```

## Run

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
