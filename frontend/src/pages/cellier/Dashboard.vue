<template>
  <Navbar />

  <div class="banniere">
    <h1 class="banniere-titre">Mes celliers</h1>
  </div>
  <!-- boutons pour créer un nouveau cellier et pour faire une recherche de
  bouteille dans les celliers -->
  <div class="entete-cellier">
    <button class="btn btn-entete-cellier" @click="creerCellier">
      <Plus class="icon" /> <span>Nouveau</span>
    </button>
    <button class="btn btn-entete-cellier" @click="rechercheBouteilleCellier">
      <Search class="icon" /> <span>Recherche </span>
    </button>
  </div>
  <!-- Liste des celliers -->
  <Cellier
    v-for="cellier in celliers"
    :key="cellier.id"
    :cellier="cellier"
    @ouvrir-modale="ouvrirModale"
  />
  <!-- Modale de confirmation de suppression -->
  <ModalConfirmation
    :show="afficherModale"
    message="Voulez-vous supprimer ce cellier ?"
    confirmText="Supprimer"
    cancelText="Annuler"
    @confirm="confirmerSuppression"
    @cancel="afficherModale = false"
  />
  <div class="espacement"></div>
</template>

<script>
import axios from "axios";
import api, { fetchCsrfToken } from "../../api";
import Cellier from "../../components/Cellier.vue";
import { Plus, Search } from "lucide-vue-next";
import Navbar from "../../components/Navbar.vue";
import ModalConfirmation from "../../components/ModalConfirmation.vue";
export default {
  components: {
    Cellier,
    Plus,
    Search,
    Navbar,
    ModalConfirmation,
  },

  data() {
    return {
      celliers: [],
      afficherModale: false,
      idASupprimer: null,
    };
  },
  // Récupérer les celliers de l'utilisateur lors du montage du composant
  mounted() {
    this.getCelliers();
  },

  methods: {
    // Méthode pour récupérer les celliers de l'utilisateur
    async getCelliers() {
      try {
        const response = await axios.get("/api/celliers");
        this.celliers = response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    // Rediriger vers la page de création de cellier
    creerCellier() {
      this.$router.push("/creer-cellier");
    },
    // Rediriger vers la page de recherche de bouteille dans les celliers
    rechercheBouteilleCellier() {
      this.$router.push("/recherche-bouteille-cellier");
    },
    // Ouvrir la modale de confirmation de suppression
    ouvrirModale(id) {
      this.idASupprimer = id;
      this.afficherModale = true;
    },
    // Confirmer la suppression du cellier
    async confirmerSuppression() {
      try {
        await fetchCsrfToken();
        // on attend que la requête DELETE se termine
        await api.delete(`/supprimer-cellier/${this.idASupprimer}`);

        // mettre à jour la liste des celliers
        this.celliers = this.celliers.filter((c) => c.id !== this.idASupprimer);

        // fermer la modale
        this.afficherModale = false;
      } catch (err) {
        console.error(err);
      }
    },
    // Méthode pour supprimer un cellier de la liste après la suppression réussie
    supprimerDansListe(id) {
      this.celliers = this.celliers.filter((c) => c.id !== id);
    },
  },
};
</script>
