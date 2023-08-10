import { Box } from '@mui/material';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

interface FormikFormProps<T> {
  initialValues: T;
  validationSchema: Yup.Schema<T>;
  onSubmit: (values: T) => void;
  children: (formikProps: {
    errors: FormikErrors<T>;
    values: T;
    touched: FormikTouched<T>;
    isSubmitting: boolean;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<FormikErrors<T>> | Promise<void>;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.ChangeEvent<any>) => void;
  }) => React.ReactNode;
}

export const FormikForm = <T extends {}>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormikFormProps<T>) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Box component="form" sx={{ mt: 1 }} onSubmit={formik.handleSubmit}>
      {children({
        errors: formik.errors,
        values: formik.values,
        touched: formik.touched,
        isSubmitting: formik.isSubmitting,
        setFieldValue: formik.setFieldValue,
        handleChange: formik.handleChange,
        handleBlur: formik.handleBlur,
      })}
    </Box>
  );
};
