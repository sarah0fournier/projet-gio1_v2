export function validateForm() {
    /**
     * Valide le formulaire de saisie de données de vol.
     * @returns {boolean} true si le formulaire est valide et false sinon.
    */

    var heightMachine = document.getElementById("heightMachine").value;
    var weightMachine = document.getElementById("weightMachine").value;

    var missingFields = []; // Liste pour stocker les champs non remplis

    if (heightMachine == "") {
        missingFields.push("Hauteur de vol")
    }
    if (weightMachine == "") {
        missingFields.push("Poids du drone")
    }


    // if (draw == null || draw.getSource().getFeatures().length <= 0){
    //     missingFields.push("Perimetre zone de vol du drone");
    // }


    if (missingFields.length > 0) {
        // Construire le message d'alerte avec les champs manquants
        var alertMessage = "Veuillez remplir les champs suivants :\n";
        for (var i = 0; i < missingFields.length; i++) {
            alertMessage += "- " + missingFields[i] + "\n";
        }
        alert(alertMessage);
        return false;
    }

    printFormData()
    
    return true;
}

export function resetForm() {
    /**
     * Réinitialise le formulaire de saisie de données de vol.
    */
    
    document.getElementById("myForm").reset();
}


// Fonction qui pourra etre supprimer par la suite c est pour tester formulaire actuelement 
export function printFormData() {
    /**
     * Affiche les données du formulaire de vol dans la console.
    */

    // Récupérer les valeurs des champs de formulaire
    var heightMachineValue = document.getElementById("heightMachine").value;
    var weightMachineValue = document.getElementById("weightMachine").value;

    // Afficher les valeurs dans la console ou les utiliser comme vous le souhaitez
    console.log("Hauteur de vol : " + heightMachineValue);
    console.log("Poids du drone : " + weightMachineValue);
}


export default function initFlightForm() {
    /**
     * Initialise le formulaire de vol en configurant les gestionnaires d'événements pour afficher/masquer la tooltip.
    */
    
    function showTooltip() {
        /**
         * Affiche la tooltip.
        */

        document.getElementById("tooltip").style.display = "block";
   }

   function hideTooltip() {
        /**
         * Masque la tooltip.
        */
       
        document.getElementById("tooltip").style.display = "none";
   }
}
