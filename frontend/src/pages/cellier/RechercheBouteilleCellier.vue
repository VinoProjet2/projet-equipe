<template>
  <Navbar />

  <div class="banniere">
    <h1 class="banniere-titre">Recherche bouteille dans les celliers</h1>
  </div>

  <div class="search-container">
    <Search class="search-icon" />
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une bouteille..."
      class="search-input"
    />
  </div>

  <div class="btn-recherche">
    <button class="btn btn-entete-cellier">
      <ListFilter class="icon" /><span>Filtrer </span>
    </button>
    <button class="btn btn-entete-cellier">
      <ArrowDownUp class="icon" /><span>Trier </span>
    </button>
  </div>

  <div class="liste-bouteilles">
    <div
      v-for="bouteille in bouteillesFiltrees"
      :key="bouteille.id"
      class="carte-bouteille"
    >
      <img :src="bouteille.vin.image_url" alt="vin" class="image-vin" />

      <div class="info">
        <h3>{{ bouteille.vin.nom }}</h3>
        <p>Cellier : {{ bouteille.cellier.nom }}</p>
        <p>Quantité : {{ bouteille.quantite }}</p>
        <p>Prix : {{ bouteille.vin.prix }} $</p>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../../components/Navbar.vue";
import { Search, ListFilter, ArrowDownUp } from "lucide-vue-next";
import axios from "axios";

export default {
  components: {
    Navbar,
    Search,
    ListFilter,
    ArrowDownUp,
  },
  data() {
    return {
      search: "",
      bouteilles: [],
    };
  },
  computed: {
    bouteillesFiltrees() {
      return this.bouteilles.filter((b) =>
        b.vin.nom.toLowerCase().includes(this.search.toLowerCase()),
      );
    },
  },
  mounted() {
    axios.get("/api/bouteilles").then((res) => {
      this.bouteilles = res.data;
    });
  },
};
</script>
