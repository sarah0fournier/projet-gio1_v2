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
Ce projet a été réalisé en 2 temps important 
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
   Le travail de Mme Fournier a été titanesque, et a consisté a migré les fonctionnalité de :
   - Activation des couches et des fonds de cartes
   - Tracer de la zone de vol
   - La partie du formulaire
   - L'esthétique générale
   Mme Görisch a développé :
   - L'affichage du tableau de résultats
   - La barre de recherche

   L'entraide a été un point central, et cela a été bénéfique, notamment pour trouver des petite erreur syntaxique bêtes.
   
### Problèmes rencontrés
La migration à 3 semaines de la fin du projet a été un travail long et très prise tête.  
Nous avons essayer de récupérer un maximum les scricts JS utilisé lors du dévloppement sans JS.  
Cela a demandé souvent des améliorations voir de recommencer à zéros.

Notammnent pour l'outils de recherche, rien n'a été récupéré de la prmière version. C'est pourquoi ces outils n'est pas aboutit, il manque par exemple l'autocomplétion implémentée dans la prmière version. 

<span style="color:red">Autre exemple Sarah de fonctionnalité qui étaient mieux avant ?</span>

<span style="color:red">La première version du code se trouve donc ici (branche ? zip? au repo?? </span>


## Etat actuel

### Fonctionnalités implémentées

### Composant Vue

## Etat idéal

### Fonctionalités à implémenter




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
