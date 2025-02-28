import { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Grid, Stack } from "@mui/material";

const SimpleForm = ({ fields, onSubmit, initialData = {}, title = "Formulaire" }) => {
  const [state, setState] = useState(initialData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setState({ ...state, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(state);
  };

  return (
    <div>
      <h2>{title}</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
              {field.type === "text" || field.type === "email" || field.type === "number" || field.type === "date" || field.type === "tel" ? (
                <TextField
                  fullWidth
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  value={state[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              ) : field.type === "radio" ? (
                <RadioGroup row name={field.name} value={state[field.name] || ""} onChange={handleChange}>
                  {field.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      control={<Radio />}
                    />
                  ))}
                </RadioGroup>
              ) : field.type === "checkbox" ? (
                <FormControlLabel
                  control={<Checkbox checked={state[field.name] || false} onChange={handleChange} name={field.name} />}
                  label={field.label}
                />
              ) : null}
            </Grid>
          ))}
        </Grid>

        <Button type="submit" variant="contained" color="primary">
          submit
        </Button>
      </form>
    </div>
  );
};

export default SimpleForm;
