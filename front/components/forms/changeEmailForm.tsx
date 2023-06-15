import React from 'react';
import { translate } from '../../i18n/i18n';
import { string } from 'yup';
import { FormControl, Input, Stack, WarningOutlineIcon, Box, Button, useToast } from 'native-base';

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

	const [submittingForm, setSubmittingForm] = React.useState(false);
	const toast = useToast();

	return (
		<Box>
			<Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>
				<FormControl
					isRequired
					isInvalid={formData.oldEmail.error !== null || formData.newEmail.error !== null}
				>
					<FormControl.Label>{translate('oldEmail')}</FormControl.Label>
					<Input
						isRequired
						type="text"
						placeholder={translate('oldEmail')}
						value={formData.oldEmail.value}
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
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.oldEmail.error}
					</FormControl.ErrorMessage>

					<FormControl.Label>{translate('newEmail')}</FormControl.Label>
					<Input
						isRequired
						type="text"
						placeholder={translate('newEmail')}
						value={formData.newEmail.value}
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
					<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
						{formData.oldEmail.error}
					</FormControl.ErrorMessage>

					<Button
						style={{ marginTop: 10 }}
						isLoading={submittingForm}
						isDisabled={formData.newEmail.error !== null}
						onPress={async () => {
							setSubmittingForm(true);
							try {
								const resp = await onSubmit(
									formData.oldEmail.value,
									formData.newEmail.value
								);
								toast.show({ description: resp });
							} catch (e) {
								toast.show({ description: e as string });
							} finally {
								setSubmittingForm(false);
							}
						}}
					>
						{translate('submitBtn')}
					</Button>
				</FormControl>
			</Stack>
		</Box>
	);
};

export default ChangeEmailForm;
