// a form for login

import React, { useEffect } from "react";
//import { useForm, FielderProvider, useField } from 'fielder';
import { Formik } from 'formik';
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { translate } from "../../i18n/i18n";
import { setUserToken, unsetUserToken } from "../../state/UserSlice";

const LoginForm = () => {
    return (
    <div>
    <h1>Anywhere in your app!</h1>
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={values => {
        const errors = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
            <TextInput
                name="email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                mode="outlined"
                label="Outlined input"
                placeholder="Type something"
                />
          {errors.email && touched.email && errors.email}
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {errors.password && touched.password && errors.password}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  </div>
    );
};

export default LoginForm;