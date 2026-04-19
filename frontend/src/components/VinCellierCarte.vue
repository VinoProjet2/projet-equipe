<template>
  <div v-if="messageSucces" class="bloc-modale-succes">
    {{ this.messageSucces }}
  </div>

  <div v-if="message" class="erreur">
    {{ this.message }}
  </div>

  <div class="nom-cellier">
    <div class="vin-cellier-carte">
      <img :src="vin.image_url" :alt="vin.nom" class="cellier-img" />
      <div>
        <h2 class="nom">{{ vin.nom }}</h2>
        <p class="meta">Quantité: {{ quantite }}</p>
        <button
          @click="modifierQuantiteVin(quantite - 1)"
          :disabled="quantite <= 1"
          class="btn-qte"
        >
          <CircleMinus />
        </button>
        <button @click="modifierQuantiteVin(quantite + 1)" class="btn-qte">
          <CirclePlus />
        </button>
      </div>
    </div>

    <div class="bouton-cellier">
      <button class="btn btn-cellier" @click="voirDetail">
        <Eye class="icons" />
      </button>

      <button class="btn btn-cellier" @click="ajouterListeAchats">
        <ShoppingBasket class="icons" />
      </button>

      <button class="btn btn-cellier" @click="$emit('ouvrir-modale', id)">
        <Trash class="icons" />
      </button>
    </div>
  </div>
</template>

<script>
import {
  Trash,
  PencilLine,
  Eye,
  CirclePlus,
  CircleMinus,
  ShoppingBasket,
} from "lucide-vue-next";
import api, { fetchCsrfToken } from "../api";
import { useAuthStore } from "../stores/auth";

export default {
  components: {
    Trash,
    PencilLine,
    Eye,
    CirclePlus,
    CircleMinus,
    ShoppingBasket,
  },
  props: {
    vin: Object,
    quantite: Number,
    id: Number,
  },
  data() {
    return {
      erreur: "",
      messageSucces: "",
      message: "",
    };
  },
  methods: {
    voirDetail() {
      this.$router.push(`/cellier-vin/${this.id}`);
    },
    // Envoie de requete pour modifier le nombre des bouteilles
    async modifierQuantiteVin(nouvelleQuantite) {
      if (nouvelleQuantite < 1) return;

      try {
        await fetchCsrfToken();
        await api.put(`/modifier-quantite/${this.id}`, {
          quantite: nouvelleQuantite,
        });

        // envoyer au parent
        this.$emit("update-quantite", {
          id: this.id,
          quantite: nouvelleQuantite,
        });
      } catch (erreur) {
        console.error(erreur);
      }
    },
    async ajouterListeAchats() {
      try {
        this.message = "";
        this.messageSucces = "";

        // Récupérer l'utilisateur connecté
        const authStore = useAuthStore();
        await authStore.fetchUsager();
        const usagerId = authStore.usager.id;

        // Récupérer l'id du vin
        const vinId = this.vin.id;

        //appel api pour ajouter a la BD
        const response = await api.post("/ajouter-bouteille-liste", {
          usager_id: usagerId,
          vin_id: vinId,
        });

        // afficher un message de succès
        this.messageSucces =
          "Votre bouteille a été ajoutée a la liste d'achat avec succès !";
        setTimeout(() => {
          this.messageSucces = "";
        }, 2000);
      } catch (erreur) {
        // afficher message d'erreur
        this.message = "Cette bouteille est déjà dans votre liste d’achats";
        setTimeout(() => {
          this.message = "";
        }, 4000);
      }
    },
  },
};
</script>
