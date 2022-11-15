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


interface ChangePasswordFormProps {
	onSubmit: (oldPassword: string, newPassword: string) => Promise<string>;
}


const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
	const [formData, setFormData] = React.useState({
		username: {
			value: "",
			error: null as string | null,
		},
	});

    return (
        <Box>
            <Stack mx="4" style={{ width: '80%', maxWidth: 400 }}>

            </Stack>
        </Box>
    );
}

export default ChangePasswordForm
