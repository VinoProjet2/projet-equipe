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
    <button class="btn btn-entete-cellier" @click="toggleFilter">
      <ListFilter class="icon" /><span>Filtrer </span>
    </button>
    <button class="btn btn-entete-cellier" @click="showTri = true">
      <ArrowDownNarrowWide class="icon" /><span>Trier </span>
    </button>
  </div>

  <div
    class="filtre-ouvrir"
    :class="{ active: showFilter }"
    @click="toggleFilter"
  ></div>

  <aside class="filter-panel" :class="{ active: showFilter }">
    <div class="filter-header">
      <h2>Filtres</h2>
    </div>

    <ul class="filter-list">
      <ColorFilter v-model="selected.couleur" />

      <FilterSelect
        :key="selected.reinitialiser"
        label="Pays"
        :items="filters.countries"
        v-model="selected.countries"
      />

      <FilterSelect
        :key="selected.reinitialiser"
        label="Régions"
        :items="filters.regions"
        v-model="selected.regions"
      />

      <FilterSelect
        :key="selected.reinitialiser"
        label="Cépages"
        :items="filters.cepages"
        v-model="selected.cepages"
      />

      <FourchetteFiltre
        :key="selected.reinitialiser"
        v-if="filters.prix"
        v-model="selected.prix"
        :minLimit="filters.prix.min"
        :maxLimit="filters.prix.max"
      />

      <FourchetteFiltre
        :key="selected.reinitialiser"
        v-model="selected.format"
        :minLimit="filters.formats.min"
        :maxLimit="filters.formats.max"
        label="Format (ml)"
      />

      <FourchetteFiltre
        :key="selected.reinitialiser"
        v-model="selected.degres"
        :minLimit="formatDonnees(filters.degres.min)"
        :maxLimit="formatDonnees(filters.degres.max)"
        label="Degré (%)"
      />

      <AnneeFiltreSelect
        :key="selected.reinitialiser"
        :items="filters.millesimes"
        v-model="selected.millesimes"
        label="Millésimes"
      />

      <button class="reset-filters" @click="reinitialiserFiltres">
        Réinitialiser les filtres
      </button>
    </ul>
  </aside>

  <ModalTri
    :show="showTri"
    :tri="tri"
    @apply="appliquerTri"
    @close="showTri = false"
  />

  <div class="liste-bouteilles">
    <div
      v-for="bouteille in bouteilles"
      :key="bouteille.id"
      class="carte-bouteille"
    >
      <img :src="bouteille.vin.image_url" class="image-vin" />

      <div class="info">
        <h3>{{ bouteille.vin.nom }}</h3>
        <p>Cellier : {{ bouteille.cellier.nom }}</p>
        <p>Prix : {{ bouteille.vin.prix }}$</p>
        <p>Quantité : {{ bouteille.quantite }}</p>

        <button
          @click="modifierQuantiteVin(bouteille.quantite - 1, bouteille.id)"
          class="btn-qte"
          :disabled="bouteille.quantite <= 1"
        >
          <CircleMinus />
        </button>

        <button
          @click="modifierQuantiteVin(bouteille.quantite + 1, bouteille.id)"
          class="btn-qte"
        >
          <CirclePlus />
        </button>
      </div>

      <div class="bouton-cellier">
        <button @click="ouvrirModale(bouteille.id)" class="btn btn-cellier">
          <Trash />
        </button>

        <button @click="voirDetail(bouteille.id)" class="btn btn-cellier">
          <Eye />
        </button>
      </div>
    </div>
  </div>

  <ModalConfirmation
    :show="afficherModale"
    message="Voulez-vous supprimer ce vin de ce cellier ?"
    confirmText="Supprimer"
    cancelText="Annuler"
    @confirm="confirmerSuppression"
    @cancel="afficherModale = false"
  />
</template>

<script>
import Navbar from "../../components/Navbar.vue";
import {
  Search,
  ListFilter,
  ArrowDownNarrowWide,
  Trash,
  Eye,
  CirclePlus,
  CircleMinus,
} from "lucide-vue-next";

import FourchetteFiltre from "../../components/Fourchette.vue";
import FilterSelect from "../../components/FiltreSelect.vue";
import AnneeFiltreSelect from "../../components/AnneeFiltreSelect.vue";
import ColorFilter from "../../components/ColorFilter.vue";
import ModalTri from "../../components/ModalTri.vue";
import ModalConfirmation from "../../components/ModalConfirmation.vue";

import axios from "axios";
import api, { fetchCsrfToken } from "../../api";

export default {
  components: {
    Navbar,
    Search,
    ListFilter,
    ArrowDownNarrowWide,
    Trash,
    Eye,
    CirclePlus,
    CircleMinus,
    FourchetteFiltre,
    FilterSelect,
    AnneeFiltreSelect,
    ColorFilter,
    ModalTri,
    ModalConfirmation,
  },

  data() {
    return {
      search: "",
      bouteilles: [],
      showFilter: false,
      showTri: false,
      tri: 0,

      selected: {
        countries: [],
        regions: [],
        cepages: [],
        prix: { min: null, max: null },
        format: { min: null, max: null },
        degres: { min: null, max: null },
        millesimes: { min: null, max: null },
        couleur: [],
        reinitialiser: 0,
      },

      filters: {
        countries: [],
        regions: [],
        cepages: [],
        prix: { min: 0, max: 0 },
        formats: { min: 0, max: 0 },
        degres: { min: 0, max: 0 },
        millesimes: [],
      },

      afficherModale: false,
      idASupprimer: null,
    };
  },

  watch: {
    search() {
      this.fetchBouteilles();
    },
    selected: {
      handler() {
        this.fetchBouteilles();
      },
      deep: true,
    },
  },

  methods: {
    formatDonnees(val) {
      return val ? parseFloat(val).toFixed(2) : 0;
    },

    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    appliquerTri(val) {
      this.tri = val;
      this.fetchBouteilles();
      this.showTri = false;
    },

    async fetchBouteilles() {
      try {
        const res = await axios.get("/api/bouteilles", {
          params: {
            recherche: this.search,
            filters: this.selected,
            tri: this.tri,
          },
        });

        this.bouteilles = res.data.data || res.data;

        if (res.data.filters) {
          this.filters = res.data.filters;
        }
      } catch (e) {
        console.error(e);
      }
    },

    async modifierQuantiteVin(qte, id) {
      if (qte < 1) return;

      await fetchCsrfToken();
      await api.put(`/modifier-quantite/${id}`, { quantite: qte });

      this.fetchBouteilles();
    },

    ouvrirModale(id) {
      this.idASupprimer = id;
      this.afficherModale = true;
    },

    async confirmerSuppression() {
      await api.delete(`/cellier-vins/${this.idASupprimer}`);

      this.bouteilles = this.bouteilles.filter(
        (b) => b.id !== this.idASupprimer,
      );

      this.afficherModale = false;
      this.fetchBouteilles();
    },

    voirDetail(id) {
      this.$router.push(`/cellier-vin/${id}`);
    },

    reinitialiserFiltres() {
      this.selected = {
        countries: [],
        regions: [],
        cepages: [],
        prix: { min: null, max: null },
        format: { min: null, max: null },
        degres: { min: null, max: null },
        millesimes: { min: null, max: null },
        couleur: [],
        reinitialiser: this.selected.reinitialiser + 1,
      };

      this.search = "";
      this.fetchBouteilles();
    },
  },

  mounted() {
    this.fetchBouteilles();
  },
};
</script>
