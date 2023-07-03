import * as yup from 'yup';
import ResponseHandler from './ResponseHandler';

const AccessTokenResponseValidator = yup.object({
	access_token: yup.string().required(),
});

type AccessTokenResponse = yup.InferType<typeof AccessTokenResponseValidator>;

export const AccessTokenResponseHandler: ResponseHandler<AccessTokenResponse> = {
	validator: AccessTokenResponseValidator,
	transformer: (value) => value,
};
