import {

  Box,
  Icon,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton
} from "@mui/material";
// STYLED COMPONENT
const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

// LISTE DES CHAUFFEURS
const chauffeurList = [
  {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    CIN: "F123456",
    telephone: "0601020304",
    adresse: "123 rue de Paris, Agadir",
    CNSS: "A1234567",
    dateRecrutement: "2022-01-15",
    disponibilite: "Disponible"
  },
  {
    nom: "El Idrissi",
    prenom: "Karim",
    email: "karim.elidrissi@example.com",
    CIN: "E654321",
    telephone: "0654789654",
    adresse: "456 avenue Mohammed V, Casablanca",
    CNSS: "B789654",
    dateRecrutement: "2023-05-20",
    disponibilite: "En congé"
  },
  {
    nom: "Ben Salah",
    prenom: "Ahmed",
    email: "ahmed.bensalah@example.com",
    CIN: "C789123",
    telephone: "0702030405",
    adresse: "789 boulevard Hassan II, Rabat",
    CNSS: "C369258",
    dateRecrutement: "2021-08-10",
    disponibilite: "Disponible"
  },
  {
    nom: "Omar",
    prenom: "Mehdi",
    email: "mehdi.omar@example.com",
    CIN: "D741852",
    telephone: "0625478963",
    adresse: "567 quartier Massira, Marrakech",
    CNSS: "D852741",
    dateRecrutement: "2019-12-05",
    disponibilite: "En mission"
  },
  {
    nom: "Fatihi",
    prenom: "Said",
    email: "said.fatihi@example.com",
    CIN: "G963852",
    telephone: "0632147859",
    adresse: "321 rue Zerktouni, Fès",
    CNSS: "E147258",
    dateRecrutement: "2020-07-22",
    disponibilite: "Disponible"
  }
];

export default function SimpleTable() {
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
      <TableHead>
            <TableRow>
              <TableCell align="left">Nom</TableCell>
              <TableCell align="center">Prénom</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">CIN</TableCell>
              <TableCell align="center">Téléphone</TableCell>
              <TableCell align="center">Adresse</TableCell>
              <TableCell align="center">CNSS</TableCell>
              <TableCell align="center">Date de Recrutement</TableCell>
              <TableCell align="center">Disponibilité</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {chauffeurList.map((chauffeur, index) => (
              <TableRow key={index}>
                <TableCell align="left">{chauffeur.nom}</TableCell>
                <TableCell align="center">{chauffeur.prenom}</TableCell>
                <TableCell align="center">{chauffeur.email}</TableCell>
                <TableCell align="center">{chauffeur.CIN}</TableCell>
                <TableCell align="center">{chauffeur.telephone}</TableCell>
                <TableCell align="center">{chauffeur.adresse}</TableCell>
                <TableCell align="center">{chauffeur.CNSS}</TableCell>
                <TableCell align="center">{chauffeur.dateRecrutement}</TableCell>
                <TableCell align="center">{chauffeur.disponibilite}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <Icon color="error">delete</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
      </StyledTable>
    </Box>
  );
}
