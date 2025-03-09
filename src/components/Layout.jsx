// import React from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import * as MuiMaterial from "@mui/material";
// import * as MuiIcons from "@mui/icons-material";
// import { BsTruckFlatbed } from "react-icons/bs";
// import { GoContainer } from "react-icons/go";
// import { AppProvider } from "@toolpad/core/AppProvider";
// import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// import { createTheme } from "@mui/material/styles";
// import allRoutes from "../routes/AllRoutes";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#fff",
//     },
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

// const NAVIGATION = [
//   {
//     kind: "header",
//     title: "Main items",
//   },
//   {
//     segment: "home",
//     title: "Home",
//     icon: <MuiIcons.Home />,
//     pattern: allRoutes.home,
//     kind: "page",
//   },
//   {
//     segment: "partenaire",
//     title: "Partenaire",
//     icon: <MuiIcons.Diversity3 />,
//     pattern: allRoutes.partenaire.base,
//     kind: "page",
//     children: [
//       {
//         segment: "morale",
//         title: "Morale",
//         icon: <MuiIcons.People />,
//         pattern: allRoutes.partenaire.morale.base,
//         kind: "page",
//       },
//       {
//         segment: "physique",
//         title: "Physique",
//         icon: <MuiIcons.Person />,
//         pattern: allRoutes.partenaire.physique.base,
//         kind: "page",
//       },
//       {
//         segment: "chauffeur",
//         title: "Chauffeur",
//         icon: <MuiIcons.Person />,
//         pattern: allRoutes.partenaire.physique.chauffeur,
//         kind: "page",
//       },
//     ],
//   },
//   {
//     segment: "camion",
//     title: "Camion",
//     icon: <MuiIcons.LocalShipping />,
//     pattern: allRoutes.camion.base,
//     kind: "page",
//     children: [
//       {
//         segment: "cabine",
//         title: "Cabine",
//         icon: <BsTruckFlatbed />,
//         pattern: allRoutes.camion.cabine,
//         kind: "page",
//       },
//       {
//         segment: "remorque",
//         title: "Remorque",
//         icon: <GoContainer />,
//         pattern: allRoutes.camion.remorque,
//         kind: "page",
//       },
//     ],
//   },
// ];

// function Layout() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const enhancedNavigation = React.useMemo(() => 
//     NAVIGATION.map((item) => ({
//       ...item,
//       // Ajoutez une propriété personnalisée pour la navigation
//       navigate: () => {
//         if (item.pattern) {
//           navigate(item.pattern, { 
//             preventScrollReset: true 
//           });
//         }
//       }
//     })), 
//     [navigate]
//   );

//   return (
//     <AppProvider
//       navigation={enhancedNavigation}
//       onNavigate={(item) => {
//         // Interceptez la navigation et utilisez notre méthode personnalisée
//         const navItem = enhancedNavigation.find(n => n.segment === item.segment);
//         if (navItem && navItem.navigate) {
//           navItem.navigate();
//           return false; // Empêche la navigation par défaut
//         }
//         return true;
//       }}
//       branding={{
//         logo: <img src="/src/assets/0.png" alt="Logo" />,
//         title: "IZORAI",
//         homeUrl: allRoutes.home,
//         sidebarExpandedWidth: "250px",
//       }}
//       theme={theme}
//     >
//       <DashboardLayout sidebarExpandedWidth="250px">
//         <Outlet />
//       </DashboardLayout>
//     </AppProvider>
//   );
// }

// export default Layout;


import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';

// Theme Setup
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Navigation Items
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'Home',
    icon: <FolderIcon />,
    path: '/',
  },
  {
    segment: 'partenaire',
    title: 'Partenaire',
    icon: <FolderIcon />,
    path: '/partenaire',
    children: [
      {
        segment: 'morale',
        title: 'Morale',
        icon: <DescriptionIcon />,
        path: '/partenaire/morale',
        // children: [
        //   { segment: 'client', title: 'Client', icon: <DescriptionIcon />, path: '/partenaire/morale/client' },
        //   { segment: 'fournisseur', title: 'Fournisseur', icon: <DescriptionIcon />, path: '/partenaire/morale/fournisseur' },
        // ],
      },
      {
        segment: 'physique',
        title: 'Physique',
        icon: <DescriptionIcon />,
        path: '/partenaire/physique',
         
   
      },
      { segment: 'chauffeur', 
        title: 'Chauffeur',
        icon: <DescriptionIcon />, 
      },
      {
        segment: 'typePartenaire',
        title: 'Type de Partenaire',
        icon: <DescriptionIcon />,
      }
    ],
  },
  {
    segment: 'camion',
    title: 'Camion',
    icon: <FolderIcon />,
    path: '/camion',
    children: [
      { segment: 'cabine', title: 'Cabine', icon: <DescriptionIcon />, path: '/camion/cabine' },
      { segment: 'remorque', title: 'Remorque', icon: <DescriptionIcon />, path: '/camion/remorque' },
    ],
  },
];

function Layout() {
  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme} window={window}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
