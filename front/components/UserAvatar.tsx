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

const UserAvatar = ({ size = 'md' }: UserAvatarProps) => {
	const user = useQuery(API.getUserInfo);
	const avatarUrl = useMemo(() => {
		if (!user.data) {
			return null;
		}
		// NOTE: We do this to avoid parsing URL with `new URL`, which is not compatible with related path
		// (which is used for production, on web)
		return `${user.data.data.avatar}?updatedAt=${user.dataUpdatedAt.toString()}`;
	}, [user.data]);

	return (
		<Avatar
			borderRadius={12}
			size={size}
			_image={{ borderRadius: 12 }}
			source={avatarUrl ? { uri: avatarUrl.toString() } : undefined}
			style={{ zIndex: 0 }}
		>
			{user.data !== undefined && getInitials(user.data.name)}
		</Avatar>
	);
};

export default UserAvatar;
