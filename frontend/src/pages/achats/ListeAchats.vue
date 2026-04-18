<template>
  <Navbar />
  <div class="banniere">
    <h2 class="banniere-titre">Liste d'achats</h2>
  </div>

  <Achat
    v-for="vin in vins"
    :key="vin.id"
    :vin="vin.vin"
    :id="vin.id"
    @ouvrir-modale="ouvrirModale"
  />

  <ModalConfirmation
    :show="afficherModale"
    message="Voulez-vous supprimer ce vin de ce cellier ?"
    confirmText="Supprimer"
    cancelText="Annuler"
    @confirm="confirmerSuppression"
    @cancel="afficherModale = false"
  />
  <div class="espacement"></div>
</template>
<script>
import Navbar from "../../components/Navbar.vue";
import Achat from "../../components/Achat.vue";
import ModalConfirmation from "../../components/ModalConfirmation.vue";
import api, { fetchCsrfToken } from "../../api";

export default {
  components: {
    Navbar,
    Achat,
    ModalConfirmation,
  },
  data() {
    return {
      cellierNom: "",
      cellierId: "",
      vins: [],
      erreur: "",
      afficherModale: false,
      idASupprimer: null,
    };
  },
  methods: {
    /**
     * Récupère les informations de liste_achats
     */
    async saisirListeAchats() {
      try {
        await fetchCsrfToken();
        const response = await api.get("/liste-achats");
        this.vins = response.data.liste_achats;
      } catch (error) {
        console.error("Erreur getUsager:", error);
      }
    },
    //Ouvrire la modale de suppression de bouteille du cellier
    ouvrirModale(id) {
      this.idASupprimer = id;
      this.afficherModale = true;
    },
    // Une fois qui l'utilisateur confirme la suppression d'un bouteille du cellier
    async confirmerSuppression() {
      try {
        // supprimer grace a cette route dans le backend, qui supprime dans la DB
        await api.delete(`/cellier-vins/${this.idASupprimer}`);

        // Supprimer localement
        this.vins = this.vins.filter((item) => item.id !== this.idASupprimer);

        // enlever l'affichage du Modale de suppression
        this.afficherModale = false;
        this.idASupprimer = null;
      } catch (err) {
        this.erreur =
          "Erreur lors de la suppression d'une bouteille dans ce cellier";
      }
    },
  },
  mounted() {
    this.saisirListeAchats();
  },
};
</script>
