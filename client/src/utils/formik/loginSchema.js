import * as Yup from "yup";

export default Yup.object().shape({
  email: Yup.string().email("Invalid email.").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot be longer than 50 characters.")
    .required("Required"),
});
