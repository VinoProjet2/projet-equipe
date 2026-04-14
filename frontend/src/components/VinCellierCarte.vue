<template>
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

    <div class="bouton-celleir">
      <button class="btn btn-cellier" @click="$emit('ouvrir-modale', id)">
        <Trash class="icons" />
      </button>

      <button class="btn btn-cellier" @click="voirDetail">
        <Eye class="icons" />
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
} from "lucide-vue-next";
import api, { fetchCsrfToken } from "../api";

export default {
  components: {
    Trash,
    PencilLine,
    Eye,
    CirclePlus,
    CircleMinus,
  },
  props: {
    vin: Object,
    quantite: Number,
    id: Number,
  },
  data() {
    return {
      erreur: "",
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
  },
};
</script>
