import React from "react";
import SimpleForm from "../form/SimpleForm";


export default function ChauffeurForm() {
  const fournisseurFields = [
    { name: "nom", type: "text", label: "Nom", required: true },
    { name: "prenom", type: "text", label: "Prénom", required: true },
    { name: "CIN", type: "text", label: "CIN", required: true },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "telephone", type: "tel", label: "Téléphone", required: true },
    { name: "adresse.type", type: "text", label: "Type d'adresse", required: true },
    { name: "adresse.rue", type: "text", label: "Rue", required: true },
    { name: "adresse.ville", type: "text", label: "Ville", required: true },
    { name: "adresse.pays", type: "text", label: "Pays", required: true },
    { name: "adresse.codePostal", type: "text", label: "Code Postal", required: true },

  ];

  const handleSubmitFournisseur = (data) => {
    console.log("Données soumises:", data);
  };

  return (
    <SimpleForm 
      fields={fournisseurFields} 
      onSubmit={handleSubmitFournisseur} 
      title="Formulaire de Fournisseur"
    />
  );
}