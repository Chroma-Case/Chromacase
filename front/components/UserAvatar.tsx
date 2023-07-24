import { Avatar } from 'native-base';
import API from '../API';
import { useQuery } from '../Queries';

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('');
};

type UserAvatarProps = Pick<Parameters<typeof Avatar>[0], 'size'>;

const UserAvatar = ({ size }: UserAvatarProps) => {
	const user = useQuery(API.getUserInfo);

	return (
		<Avatar size={size} source={{ uri: user.data?.data.avatar }} style={{ zIndex: 0 }}>
			{user.data !== undefined && getInitials(user.data.name)}
		</Avatar>
	);
};

export default UserAvatar;
