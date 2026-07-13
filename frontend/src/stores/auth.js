import { defineStore } from "pinia";
import { api, decodeToken, scheduleRefresh } from "../api/client";
// Création du store nomme auth dans un composant Vue useAuthStore() 
export const useAuthStore = defineStore("auth", {
  // Le state contient les données du store.
  state: () => ({
    token: localStorage.getItem("token") || null,
    refresh: localStorage.getItem("refresh") || null,
    username: localStorage.getItem("username") || null,
  }),
//Les getters ressemblent à des propriétés calculées (computed).

// Ils calculent une valeur à partir du state. 
// Si j'ai un access token OU un refresh token,
// alors l'utilisateur est considéré comme connecté.
  getters: {
    isAuthenticated: (state) => !!(state.token || state.refresh),
// l retourne un objet représentant l'utilisateur.
    user: (state) => {
      const decoded = state.token
        ? decodeToken(state.token)
        : state.refresh
          ? decodeToken(state.refresh)
          : null;
      const name =
        state.username ||
        (decoded && (decoded.username || decoded.user_id)) ||
        "Utilisateur";
      return { username: name, id: decoded?.user_id ?? null };
    },
  },
// Les actions sont des fonctions qui modifient le state.
  actions: {
    // Lorsque l'utilisateur clique sur : se connecter vue appele auth.login(username,password)
    async login(username, password) {
      //  ici on Envoi au backend cette requets coreponds POST /api/token/ qui dans notre backend
      const data = await api.post("token/", { username, password });
      this.token = data.access;
      this.refresh = data.refresh;
      this.username = username;
      localStorage.setItem("token", this.token);
      localStorage.setItem("refresh", this.refresh);
      localStorage.setItem("username", username);
      scheduleRefresh();
      return data;
    },

    logout() {
      this.token = null;
      this.refresh = null;
      this.username = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
    },
  },
});
