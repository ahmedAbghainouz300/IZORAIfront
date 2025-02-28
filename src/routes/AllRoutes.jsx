const allRoutes = {
  home: "/home",
  about: "/about",
  partenaire: {
    base: "/partenaire",
    morale: {
      base: "/partenaire/morale",
      client: "/partenaire/morale/client",
      fournisseur: "/partenaire/morale/fournisseur",
    },
    physique: {
      base: "/partenaire/physique",
      chauffeur: "/partenaire/physique/chauffeur",
      client: "/partenaire/physique/client",
      fournisseur: "/partenaire/physique/fournisseur",
    },
  },
  camion: {
    base: "/camion",
    cabine: "/camion/cabine",
    remorque: "/camion/remorque",
  },
};

export default allRoutes;