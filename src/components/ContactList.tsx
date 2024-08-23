import Highlighter from 'react-highlight-words';

import { Fragment, useMemo } from 'react';

import { Space, Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';

import ContactForm from '@/components/ContactForm';
import DeleteContact from '@/components/DeleteContact';

import { Contact } from '@/types/Contact';
import { Pagination } from '@/types/Pagination';
import { TableParams } from '@/types/Table';

interface ContactListProps {
	data: Pagination<Contact[]> | undefined;
	isLoading: boolean;
	isPlaceholderData: boolean;
	tableParams: TableParams;
	setTableParams: React.Dispatch<React.SetStateAction<TableParams>>;
	searchValue: string;
}

/**
 * Renders a table of users with search and filter functionality.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Pagination<User[]> | undefined} props.data - The paginated user data.
 * @param {boolean} props.isLoading - Indicates if the data is currently being loaded.
 * @param {boolean} props.isPlaceholderData - Indicates if the data is a placeholder.
 * @param {TableParams} props.tableParams - The table parameters for filtering and sorting.
 * @param {React.Dispatch<React.SetStateAction<TableParams>>} props.setTableParams - The function to update the table parameters.
 * @param {string} props.searchValue - The search value.
 * @returns {JSX.Element} The rendered UsersList component.
 */
function ContactList({
	data,
	isLoading,
	isPlaceholderData,
	tableParams,
	setTableParams,
	searchValue,
}: ContactListProps): JSX.Element {
	const columns: ColumnsType<Contact> = useMemo(
		() => [
			{
				title: 'Name',
				dataIndex: 'firstName',
				key: 'firstName',
				sorter: (a, b) => a.firstName.localeCompare(b.firstName),
				render: (firstName: Contact['firstName']) => {
					return (
						<Highlighter
							highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
							searchWords={[searchValue]}
							autoEscape
							textToHighlight={firstName.toString()}
						/>
					);
				},
			},
			{
				title: 'Last Name',
				dataIndex: 'lastName',
				key: 'lastName',
				sorter: (a, b) => a.lastName.localeCompare(b.lastName),
				render: (lastName: Contact['lastName']) => {
					return (
						<Highlighter
							highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
							searchWords={[searchValue]}
							autoEscape
							textToHighlight={lastName.toString()}
						/>
					);
				},
			},
			{
				title: 'Address',
				dataIndex: 'address',
				key: 'address',
				render: (address: Contact['address']) => address.address,
			},
			{
				title: 'City',
				dataIndex: 'address',
				key: 'city',
				render: (address: Contact['address']) => address.city,
			},
			{
				title: 'Country',
				dataIndex: 'address',
				key: 'country',
				sorter: (a, b) => a.address.country.localeCompare(b.address.country),
				render: (address: Contact['address']) => address.country,
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'Number',
				dataIndex: 'phone',
				key: 'number',
			},
			{
				title: 'Action',
				key: 'action',
				render: (_, contact: Contact) => (
					<Space size="middle">
						<ContactForm contact={contact} />
						<DeleteContact contactId={contact.id} hasSearch={searchValue !== ''} />
					</Space>
				),
			},
		],
		[searchValue]
	);

	const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
		setTableParams({
			pagination,
			filters,
			...sorter,
		});
	};

	return (
		<Fragment>
			<Table
				className="overflow-x-auto"
				loading={isLoading || isPlaceholderData}
				columns={columns}
				dataSource={data?.users}
				rowKey={({ id }) => id}
				onChange={handleTableChange}
				pagination={{ ...tableParams.pagination, total: data?.total }}
			/>
		</Fragment>
	);
}

export default ContactList;
