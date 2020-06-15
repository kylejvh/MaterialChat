import React from "react";
import { useField } from "formik";
import TextField from "@material-ui/core/TextField";

export default ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const errorHandle = meta.touched && meta.error ? meta.error : null;

  return (
    <>
      <TextField
        label={label}
        error={Boolean(errorHandle)}
        helperText={errorHandle}
        variant="outlined"
        {...field}
        {...props}
      />
    </>
  );
};
