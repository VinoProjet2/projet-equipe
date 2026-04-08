<template>
  <div class="hero-container">
    <img src="../../assets/img/cellier.jpg" class="hero-image" />
    <img src="../../assets/img/bouteille.png" class="bouteille" />
  </div>

  <div class="infos">
    <div class="infos-stock">
      <img
        src="../../assets/img/bouteille.png"
        alt="bouteille vin"
        class="bouteille-total"
      />
      <p>En stock:<strong>13</strong></p>
    </div>
    <div class="infos-valeur">
      <img
        src="../../assets/img/valeur.png"
        alt="image monnaie"
        class="valeur-img"
      />

      <p>Valeur :<strong>256 $</strong></p>
    </div>
  </div>
  <div class="entete-cellier">
    <h2>Vos celliers</h2>
    <button class="btn btn-entete-cellier" @click="creerCellier">
      <Plus class="icon" /> <span>Créer cellier</span>
    </button>
  </div>
  <Cellier v-for="cellier in celliers" :key="cellier.id" :cellier="cellier" />
</template>

<script>
import axios from "axios";
import Cellier from "../../components/Cellier.vue";
import { Plus } from "lucide-vue-next";

export default {
  components: {
    Cellier,
    Plus,
  },

  data() {
    return {
      celliers: [],
    };
  },

  mounted() {
    this.getCelliers();
  },

  methods: {
    async getCelliers() {
      try {
        const response = await axios.get("/api/celliers");
        this.celliers = response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    creerCellier() {
      this.$router.push("/creer-cellier");
    },
  },
};
</script>

<style scoped></style>
