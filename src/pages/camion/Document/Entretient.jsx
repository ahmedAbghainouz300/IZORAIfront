import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import CabineDialog from "../../../components/dialog/Camion/CabineDialog";

import "../../../styles/cabine.css";
import AssuranceDialog from "../../../components/dialog/Camion/Document/AssuranceDialog";
import EntretienDialog from "../../../components/dialog/Camion/Document/EntretienDialog";
import CarburantDialog from "../../../components/dialog/Camion/Document/CarburantDialog";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    flex: 1,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    flex: 1,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 1,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

// Custom Toolbar with only the CSV/Excel Export Button
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Entretient() {
  const [entretientDialogOpen, setEntretientDialogOpen] = React.useState(false);

  // Entretient
  const handleOpenEntretientDialog = () => {
    setEntretientDialogOpen(true);
  };
  const handleCloseEntretientDialog = () => {
    setEntretientDialogOpen(false);
  };

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <div className="buttons">
        <button className="blue-button" onClick={handleOpenEntretientDialog}>
          <p>Nouveau entretient</p>
        </button>
      </div>

      {entretientDialogOpen && (
        <EntretienDialog
          vopen={entretientDialogOpen}
          onClose={handleCloseEntretientDialog}
        />
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        style={{ border: "none", marginLeft: 30 }}
        sx={{
          "@media print": {
            ".MuiDataGrid-toolbarContainer": {
              display: "none",
            },
          },
        }}
      />
    </Box>
  );
}
