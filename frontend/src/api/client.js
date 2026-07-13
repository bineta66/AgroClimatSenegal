// C'est l'adresse du backend le base-url , Toutes les requêtes partiront ici..
const BASE_URL = "http://localhost:8000/api/";
// Il sert à lancer un minuteur.
let refreshTimer = null;
// Celui-ci évite que plusieurs rafraîchissements soient lancés en même temps.
let refreshingPromise = null;

/* ============================
   JWT decodeToken()
   Un JWT ressemble à ça :
    xxxxx.yyyyy.zzzzz
    Il possède 3 parties.

      Header
      Payload
      Signature
Le payload contient :

{
   user_id: 5,
   username: "bineta",
   exp: 1750000000
}
============================ */

export function decodeToken(token) {
  try {
    // si on recupere seulement yyyyy qui dans le payload
    const payload = token.split(".")[1];
    //   atob ici on a decode cet valeur en base 64 puis transforme le texte en objet JavaScript.
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function isTokenExpired(token = localStorage.getItem("token")) {
  if (!token) return true;

  const payload = decodeToken(token);

  if (!payload || !payload.exp) {
    return true;
  }

  return Date.now() >= payload.exp * 1000;
}

/* ============================
   Supprime le token.
   supprime le refresh.
   arrête le minuteur.
============================ */

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");

  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export function logout() {
  clearAuth();
  redirectToLogin();
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/* ============================
   Refresh Token
   // C'est la fonction la plus importante et Elle envoie 
// POST/api/token/refresh/
============================ */

async function doRefresh() {
  if (refreshingPromise) {
    return refreshingPromise;
  }
// cet fonction calcule  quand faut-il faire le refresh ?
  refreshingPromise = (async () => {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) return false;

    try {
      const res = await fetch(`${BASE_URL}token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      if (!data.access) return false;

      localStorage.setItem("token", data.access);

      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }

      return true;
    } catch {
      return false;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
}

export async function refreshToken() {
  const ok = await doRefresh();

  if (ok) {
    scheduleRefresh();
  } else {
    clearAuth();
    redirectToLogin();
  }

  return ok;
}

/* ============================
   Refresh automatique
============================ */

export function scheduleRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const token = localStorage.getItem("token");

  const payload = token ? decodeToken(token) : null;

  if (!payload?.exp) return;

  // Rafraîchir 30 secondes avant expiration
  const delay = payload.exp * 1000 - Date.now() - 30000;

  if (delay <= 0) {
    refreshToken();
    return;
  }

  refreshTimer = setTimeout(refreshToken, delay);
}

/* ============================
   Requêtes HTTP
   C'est LA fonction qui envoie toutes les requêtes.
   Toutes les fonctions
============================ */

async function request(path, options = {}, retried = false) {
  // Les headers sont des informations envoyées au serveur.
  const headers = { ...(options.headers || {}) };

  let token = localStorage.getItem("token");

  // Vérifie si le token est expiré avant d'envoyer la requête
  if (token && isTokenExpired(token)) {
    const ok = await refreshToken();

    if (!ok) {
      throw { detail: "Session expirée" };
    }

    token = localStorage.getItem("token");
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
//  Construction de l'URL
  const url =
    BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
// Construction de l'URL
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (!retried && localStorage.getItem("refresh")) {
      const ok = await refreshToken();

      if (ok) {
        return request(path, options, true);
      }
    }

    clearAuth();
    redirectToLogin();

    throw {
      detail: "Session expirée",
    };
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  let data = null;

  if (contentType?.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw data || { detail: `Erreur ${response.status}` };
  }

  return data;
}

/* ============================
   API on crées un petit service.
============================ */

export const api = {
  get(path) {
    return request(path, {
      method: "GET",
    });
  },

  post(path, body) {
    return request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch(path, body) {
    return request(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },

  upload(path, formData) {
    return request(path, {
      method: "POST",
      body: formData,
    });
  },
};