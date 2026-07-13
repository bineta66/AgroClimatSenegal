import { defineStore } from "pinia";
import { api } from "../api/client";

export const useInventoryStore = defineStore("inventory", {
  state: () => ({
    warehouses: [],
    products: [],
    loading: false,
    error: null,
  }),

  getters: {
    warehouseMap: (state) =>
      Object.fromEntries(state.warehouses.map((w) => [w.id, w])),

    warehouseName: (state) => (id) =>
      state.warehouses.find((w) => w.id === id)?.nom ?? "—",
  },

  actions: {
    async fetchWarehouses() {
      this.loading = true;
      this.error = null;
      try {
        this.warehouses = await api.get("warehouses/");
      } catch (e) {
        this.error = e.detail || "Erreur de chargement des entrepôts";
      } finally {
        this.loading = false;
      }
    },

    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        this.products = await api.get("products/");
      } catch (e) {
        this.error = e.detail || "Erreur de chargement des produits";
      } finally {
        this.loading = false;
      }
    },

    productNameExists(name) {
      if (!name || !this.products) return false;
      return this.products.some((p) => p.nom.trim().toLowerCase() === name.trim().toLowerCase());
    },

    async refresh() {
      await Promise.all([this.fetchWarehouses(), this.fetchProducts()]);
    },

    async transferProduct(productId, entrepotId) {
      return await api.post(`products/${productId}/move/`, {
        new_warehouse_id: entrepotId,
      });
    },

    async createWarehouse(payload) {
      await api.post("warehouses/", payload);
      await this.fetchWarehouses();
    },

    async updateWarehouse(id, payload) {
      await api.put(`warehouses/${id}/`, payload);
      await this.fetchWarehouses();
    },

    async deleteWarehouse(id) {
      await api.delete(`warehouses/${id}/`);
      await this.fetchWarehouses();
    },

    async createProduct(payload) {
      await api.post("products/", payload);
      await this.fetchProducts();
    },

    async updateProduct(id, payload) {
      await api.put(`products/${id}/`, payload);
      await this.fetchProducts();
    },

    async deleteProduct(id) {
      await api.delete(`products/${id}/`);
      await this.fetchProducts();
    },
  },
});
