import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import { useToast, Column } from 'native-base';
import TextFormField from '../UI/TextFormField';
import ButtonBase from '../UI/ButtonBase';
import { Sms } from 'iconsax-react-native';
import { useWindowDimensions } from 'react-native';

interface GuestFormProps {
	onSubmit: (username: string) => Promise<string>;
}

const validationSchemas = {
	username: string().required('Username is required'),
};

const GuestForm = ({ onSubmit }: GuestFormProps) => {
	const [formData, setFormData] = React.useState({
		username: {
			value: '',
			error: null as string | null,
		},
	});

	const toast = useToast();
	const layout = useWindowDimensions();

	return (
		<Column style={{ width: layout.width * 0.5 }}>
			<TextFormField
				style={{ marginVertical: 10 }}
				isRequired
				icon={Sms}
				placeholder={translate('username')}
				value={formData.username.value}
				error={formData.username.error}
				onChangeText={(t) => {
					let error: null | string = null;
					validationSchemas.username
						.validate(t)
						.catch((e) => (error = e.message))
						.finally(() => {
							setFormData({ ...formData, username: { value: t, error } });
						});
				}}
			/>
			<ButtonBase
				isDisabled={formData.username.error !== null || formData.username.value === ''}
				type={'filled'}
				title={translate('submitBtn')}
				style={{ marginVertical: 10 }}
				onPress={() => {
					onSubmit(formData.username.value)
						.then((e) => {
							toast.show({ description: e as string });
						})
						.catch((e) => {
							toast.show({ description: e as string });
						});
				}}
			/>
		</Column>
	);
};

export default GuestForm;
