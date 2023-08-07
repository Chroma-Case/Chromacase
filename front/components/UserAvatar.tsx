import { Avatar } from 'native-base';
import API from '../API';
import { useQuery } from '../Queries';
import { useMemo } from 'react';

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('');
};

type UserAvatarProps = Pick<Parameters<typeof Avatar>[0], 'size'>;

const UserAvatar = ({ size }: UserAvatarProps) => {
	const user = useQuery(API.getUserInfo);
	const avatarUrl = useMemo(() => {
		if (!user.data) {
			return null;
		}
		const url = new URL(user.data.data.avatar);

		url.searchParams.append('updatedAt', user.dataUpdatedAt.toString());
		return url;
	}, [user.data]);

	return (
		<Avatar
			size={size}
			source={avatarUrl ? { uri: avatarUrl.toString() } : undefined}
			style={{ zIndex: 0 }}
		>
			{user.data !== undefined && getInitials(user.data.name)}
		</Avatar>
	);
};

export default UserAvatar;
