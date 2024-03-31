export function validateForm() {
    /**
     * Valide le formulaire de saisie de données de vol pour hauteur de vol et poids du drone.
     * @returns {boolean} true si le formulaire est valide et false sinon.
    */

    var weightMachine = document.getElementById("weightMachine").value
    var heightMachine = document.getElementById("heightMachine").value

    var missingFields = []; // Liste pour stocker les champs non remplis

    if (heightMachine == "") {
        missingFields.push("Hauteur de vol")
    }
    if (weightMachine == "") {
        missingFields.push("Poids du drone")
    }

    if (missingFields.length > 0) {
        // Construire le message d'alerte avec les champs manquants
        var alertMessage = "Veuillez remplir les champs suivants :\n"
        for (var i = 0; i < missingFields.length; i++) {
            alertMessage += "- " + missingFields[i] + "\n"
        }
        alert(alertMessage)
        return false
    }   
    return true;
}


export function resetForm() {
    /**
     * Réinitialise le formulaire de saisie de données de vol.
    */
    
    document.getElementById("myForm").reset()
}
