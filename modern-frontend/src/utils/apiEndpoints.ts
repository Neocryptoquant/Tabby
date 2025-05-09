export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    USER: '/api/user/',
  },
  TOURNAMENTS: {
    LIST: '/api/tournaments/',
    DETAIL: (id: string) => `/api/tournaments/${id}/`,
    CREATE: '/api/tournaments/',
    UPDATE: (id: string) => `/api/tournaments/${id}/`,
    DELETE: (id: string) => `/api/tournaments/${id}/`,
  },
  TEAMS: {
    LIST: '/api/teams/',
    CREATE: '/api/teams/',
    UPDATE: (id: number) => `/api/teams/${id}/`,
    DELETE: (id: number) => `/api/teams/${id}/`,
  },
  ADJUDICATORS: {
    LIST: '/api/adjudicators/',
    CREATE: '/api/adjudicators/',
    UPDATE: (id: number) => `/api/adjudicators/${id}/`,
    DELETE: (id: number) => `/api/adjudicators/${id}/`,
  },
  VENUES: {
    LIST: '/api/venues/',
    CREATE: '/api/venues/',
    UPDATE: (id: number) => `/api/venues/${id}/`,
    DELETE: (id: number) => `/api/venues/${id}/`,
  },
  DRAW: {
    LIST: '/api/draw/',
    GENERATE: '/api/draw/generate/',
    PUBLISH: '/api/draw/publish/',
  },
  RESULTS: {
    LIST: '/api/results/',
    CREATE: '/api/results/',
    UPDATE: (id: number) => `/api/results/${id}/`,
  },
};
