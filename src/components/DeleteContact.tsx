import { DeleteOutlined } from '@ant-design/icons';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, notification, Popconfirm } from 'antd';

import { deleteUser } from '@/api/dummyApi';

import { Contact } from '@/types/Contact';
import { Pagination } from '@/types/Pagination';

const NOTIFICATION_KEY = 'delete-contact';

function DeleteContact({ contactId }: { contactId: Contact['id']; hasSearch: boolean }): JSX.Element {
	const queryClient = useQueryClient();
	const [queryKey] = queryClient
		.getQueriesData({
			type: 'active',
			queryKey: ['users'],
		})
		.flat() as QueryKey[];

	const { isPending, mutate } = useMutation({
		mutationFn: deleteUser,
		onMutate: async (contactId: Contact['id']) => {
			await queryClient.cancelQueries({ queryKey: queryKey });

			const previousContacts = queryClient.getQueryData<Pagination<Contact[]>>(queryKey);

			if (previousContacts) {
				queryClient.setQueryData<Pagination<Contact[]>>(queryKey, {
					...previousContacts,
					users: previousContacts.users.filter((contact) => contact.id !== contactId),
				});
			}

			return { previousContacts };
		},
		onError: (error, _, context) => {
			queryClient.setQueryData(queryKey, context?.previousContacts);
			notification.destroy(NOTIFICATION_KEY);
			notification.error({
				key: NOTIFICATION_KEY,
				message: 'Failed to delete the contact',
				description: error.message,
			});
		},
		onSuccess: () => {
			notification.destroy(NOTIFICATION_KEY);
			notification.success({
				key: NOTIFICATION_KEY,
				message: `Contact #${contactId} deleted successfully`,
			});
		},
	});
	const handleConfirm = () => {
		mutate(contactId);
	};

	return (
		<Popconfirm
			placement="topRight"
			title="Delete the contact"
			description="Are you sure to delete this contact?"
			onConfirm={handleConfirm}
			okText="Yes"
			okButtonProps={{ danger: true }}
			cancelText="No">
			<Button loading={isPending} danger icon={<DeleteOutlined />}>
				Delete
			</Button>
		</Popconfirm>
	);
}

export default DeleteContact;
