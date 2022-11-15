import React from "react";
import { translate } from "../../i18n/i18n";
import { string } from "yup";
import {
	FormControl,
	Input,
	Stack,
	WarningOutlineIcon,
	Box,
	Button,
	useToast,
} from "native-base";

interface ChangeEmailFormProps {
	onSubmit: (newEmail: string) => Promise<string>;
}


const ChangeEmailForm = ({ onSubmit }: ChangeEmailFormProps) => {
    const [formData, setFormData] = React.useState({
		newEmail: {
			value: "",
			error: null as string | null,
		}
	});

    const [submittingForm, setSubmittingForm] = React.useState(false);
	const toast = useToast();

    return (
        <Box>
            <Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>
                <FormControl>
                    <FormControl.Label>Test</FormControl.Label>
                    <Input
                        // type="text"
                        // placeholder="Current Email address"
                        // value={formData.newEmail.value}
                        // onChangeText={(t) => {
                        // let error: null | string = null;
                        //         setFormData({ ...formData, newEmail: { value: t, error } });
                        //     }
                        // }
                    />
                </FormControl>
                <Button
							style={{ marginTop: 10 }}
							// isLoading={submittingForm}
							// isDisabled={
							// 	formData.newEmail.error !== null
							// }
							// onPress={async () => {
							// 	setSubmittingForm(true);
							// 	try {
							// 		const resp = await onSubmit(
							// 			formData.newEmail.value
							// 		);
							// 		toast.show({ description: resp });
							// 	} catch (e) {
							// 		toast.show({ description: e as string });
							// 	} finally {
							// 		setSubmittingForm(false);
							// 	}
							// }}
						>
                            Bite
						</Button>
            </Stack>
        </Box>
    );
}

export default ChangeEmailForm
