import * as yup from 'yup';

type ResponseHandler<APIType, ModelType = APIType> = {
	validator: yup.Schema<APIType>;
	transformer: (value: APIType) => ModelType;
};

export default ResponseHandler;
