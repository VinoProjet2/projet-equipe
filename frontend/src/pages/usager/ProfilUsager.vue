<template>
  <div class="container">
    <p v-if="erreur">{{ erreur }}</p>

    <div v-if="usager">
      <p>Nom : {{ usager.nom }}</p>
      <!-- <p>Prénpm : {{ usager.prenom }}</p> -->
      <p>Courriel : {{ usager.courriel }}</p>
    </div>

    <button type="button" class="signup-btn" @click="supprimerUsager">
      Supprimer le compte
    </button>
  </div>
</template>

<script>
import api from "../../api";

export default {
  data() {
    return {
      usager: null,
      erreur: null,
    };
  },

  methods: {
    // Récupère les informations du profil de l'usager connecté
    async afficherProfil() {
      try {
        const response = await api.get("/afficher-usager");
        this.usager = response.data;
      } catch (erreur) {
        this.erreur = "Une erreur est survenue";
      }
    },
    // Supprime le compte de l'usager connecté
    async supprimerUsager() {
      // todo : Ajouter une boite modale

      try {
        // suppression du compte de l'usager
        await api.delete("/supprimer-usager");
        // Redirige l'usager vers la page de connexion après la suppression
        this.$router.push("/deconnexion");
        // Redirige vers la page de connexion après la déconnexion
        this.$router.push("/connexion-usager");
      } catch (erreur) {
        this.erreur = "Erreur lors de la suppression";
      }
    },
  },
  // Affiche le profil de l'usager dès que le composant est monté
  mounted() {
    this.afficherProfil();
  },
};
</script>
