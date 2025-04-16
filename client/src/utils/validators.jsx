import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email address")
        .max(50, "Email must be less than 50 characters"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(20, "Password must be less than 20 characters")
});

export const productValidationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    price: Yup.number()
        .typeError('Price must be a number')
        .positive('Price must be positive')
        .required('Price is required'),
    description: Yup.string(),
    category: Yup.string().required('Category is required'),
    stock: Yup.number()
        .typeError('Stock must be a number')
        .required('Stock is required'),
    manufacturingDate: Yup.date()
        .required('Manufacturing date is required')
        .max(new Date(), 'Manufacturing date cannot be in the future'),
    image: Yup.mixed()
        .test('file-or-existing', 'Image is required', function (value) {
            return this.parent.existingImage || value instanceof File;
        })
        .test('fileSize', 'Image size cannot be larger than 2MB', (value) => {
            if (!value || typeof value === 'string') return true;
            return value.size <= 2097152;
        })
});