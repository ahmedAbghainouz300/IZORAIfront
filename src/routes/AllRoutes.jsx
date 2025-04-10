const AllRoutes = {
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
      client: "/partenaire/physique/client",
      fournisseur: "/partenaire/physique/fournisseur",
    },
    typePartenaire: {
      base: "/partenaire/typePartenaire",
    },
    chauffeur: "/partenaire/chauffeur",
  },
  camion: {
    base: "/camion",
    cabine: "/camion/cabine",
    remorque: "/camion/remorque",
  },
  document: {
    base: "/document",
    assurance: "/document/assurance",
    entretient: "/document/entretient",
    carburant: "/document/carburant",
    carteGrise: "/document/carteGrise",
  },
  marchandise: {
    base: "/marchandise",
  },
  demandeCotation: {
    base: "/demandeCotation",
  },
  voyage: {
    base: "/voyage",
  },
};

export default AllRoutes;
