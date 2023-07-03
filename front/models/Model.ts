import * as yup from 'yup';

export const ModelValidator = yup.object({
	id: yup.number().required(),
});

type Model = yup.InferType<typeof ModelValidator>;

export default Model;
