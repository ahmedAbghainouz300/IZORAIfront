// apex-grid-factory.js
import * as React from "react";
import { createComponent } from "@lit-labs/react";
import { ApexGrid } from "apex-grid";

// Register the ApexGrid component
ApexGrid.register();

// Function to create an ApexGrid wrapper
export function createApexGridWrapper() {
  return createComponent({
    tagName: "apex-grid",
    elementClass: ApexGrid,
    react: React,
    events: {
      onSorting: "sorting",
      onSorted: "sorted",
      onFiltering: "filtering",
      onFiltered: "filtered",
    },
  });
}
