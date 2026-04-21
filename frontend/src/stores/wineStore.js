import { defineStore } from "pinia";

export const useWineStore = defineStore("wine", {
  state: () => ({
    wines: [],
    total: 0,
    filters: {},
    loading: false,
  }),

  actions: {
    // Récupère les vins en fonction des paramètres de pagination, de tri, de recherche et de filtres
    async fetchAllWines(
      page = 1,
      perPage = 12,
      selectedFilters = {},
      recherche = "",
      choix = 0,
    ) {
      this.loading = true;

      try {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("per_page", perPage);
        params.append("tri", choix);
        // Ajoute les paramètres de recherche et de filtres à l'URL
        if (recherche) {
          params.append("recherche", recherche);
        }
        // Ajoute les filtres sélectionnés à l'URL
        Object.keys(selectedFilters).forEach((key) => {
          const value = selectedFilters[key];
          // Gère les différents types de filtres (tableaux, objets, etc.)
          if (Array.isArray(value)) {
            value.forEach((v) => {
              params.append(`filters[${key}][]`, v);
            });
          }
          // Gère les filtres de type intervalle (min/max)
          else if (typeof value === "object" && value !== null) {
            if (value.min !== null) {
              params.append(`filters[${key}][min]`, value.min);
            }
            if (value.max !== null) {
              params.append(`filters[${key}][max]`, value.max);
            }
          }
        });
        // Effectue la requête fetch avec les paramètres construits
        const res = await fetch(
          `http://localhost:8000/vins?${params.toString()}`,
        );
        // Vérifie si la réponse est OK avant de traiter les données
        const data = await res.json();
        // Met à jour les états du magasin avec les données reçues
        this.wines = data.data || [];
        this.total = data.total || 0;
        this.filters = data.filters || {};
      } catch (e) {
        console.error("Erreur fetch vins:", e);
      } finally {
        this.loading = false;
      }
    },
  },
});
