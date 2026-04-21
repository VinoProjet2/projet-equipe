import { defineStore } from "pinia";
import axios from "axios";
// Store pour gérer les détails d'une bouteille de vin dans la liste d'achat
export const useListeStore = defineStore("listeAchat", {
  // State pour stocker les détails de la bouteille de vin et l'état de chargement
  state: () => ({
    bouteilleVin: null,
    loading: false,
  }),

  actions: {
    // Action pour récupérer les détails d'une bouteille de vin à partir de l'API
    async fetchVin(id) {
      this.loading = true;
      this.bouteilleVin = null;

      try {
        // Effectue une requête GET à l'API pour récupérer les détails de la bouteille de vin
        const res = await axios.get(
          `http://localhost:8000/api/liste-achats-vin/${id}`,
          { withCredentials: true },
        );

        this.bouteilleVin = res.data;
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 404) {
          this.bouteilleVin = null;
        }
      } finally {
        // Assure que l'état de chargement est mis à jour, même en cas d'erreur
        this.loading = false;
      }
    },
  },
});
