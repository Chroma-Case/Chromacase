import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import { useToast, Flex } from 'native-base';
import TextFormField from '../UI/TextFormField';
import ButtonBase from '../UI/ButtonBase';
import { Sms } from 'iconsax-react-native';

interface ChangeEmailFormProps {
	onSubmit: (oldEmail: string, newEmail: string) => Promise<string>;
}

const validationSchemas = {
	email: string().email('Invalid email').required('Email is required'),
};

const ChangeEmailForm = ({ onSubmit }: ChangeEmailFormProps) => {
	const [formData, setFormData] = React.useState({
		oldEmail: {
			value: '',
			error: null as string | null,
		},
		newEmail: {
			value: '',
			error: null as string | null,
		},
	});

	const toast = useToast();

	return (
		<Flex style={{ width: '100%', maxWidth: 420 }}>
			<TextFormField
				style={{ marginVertical: 10 }}
				isRequired
				icon={Sms}
				placeholder={translate('oldEmail')}
				value={formData.oldEmail.value}
				error={formData.oldEmail.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.email
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, oldEmail: { value: t, error } });
						});
				}}
			/>
			<TextFormField
				style={{ marginVertical: 10 }}
				isRequired
				autoComplete="off"
				icon={Sms}
				placeholder={translate('newEmail')}
				value={formData.newEmail.value}
				error={formData.newEmail.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.email
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, newEmail: { value: t, error } });
						});
				}}
			/>
			<ButtonBase
				isDisabled={
					formData.oldEmail.error !== null ||
					formData.newEmail.error !== null ||
					formData.oldEmail.value === '' ||
					formData.newEmail.value === ''
				}
				type={'filled'}
				title={translate('submitBtn')}
				style={{ marginVertical: 10 }}
				onPress={async () => {
					try {
						const resp = await onSubmit(
							formData.oldEmail.value,
							formData.newEmail.value
						);
						toast.show({ description: resp });
					} catch (e) {
						toast.show({ description: e as string });
					}
				}}
			/>
		</Flex>
	);
};

export default ChangeEmailForm;
