import * as Yup from 'yup';

const formValidationSchema = Yup.object().shape({
  title: Yup.string().required('Titel ist ein Pflichtfeld.'),
  authorFirstname: Yup.string().optional(),
  authorLastname: Yup.string().optional(),
  isbn: Yup.string().required('ISBN ist ein Pflichtfeld.'),
});

export default formValidationSchema;
