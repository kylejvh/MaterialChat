import * as Yup from "yup";

export const emailUsernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be 4 characters or more.")
    .max(50, "Username cannot be longer than 50 characters.")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  passwordCurrent: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot be longer than 50 characters.")
    .required("Required"),
});

export const passwordSchema = Yup.object().shape({
  passwordCurrent: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot be longer than 50 characters.")
    .required("Required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password cannot be longer than 50 characters.")
    .required("Required"),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "New passwords must match.")
    .required("Required"),
});
