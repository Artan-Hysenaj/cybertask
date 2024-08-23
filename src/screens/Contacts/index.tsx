import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useState } from 'react';

import { Flex, Input } from 'antd';

import { getUsers } from '@/api/dummyApi';

import ContactForm from '@/components/ContactForm';
import ContactList from '@/components/ContactList';
import ErrorBoundary from '@/components/ErrorBoundary';

import { PAGE_SIZE } from '@/lib/constants';

import { Contact } from '@/types/Contact';
import { Pagination } from '@/types/Pagination';
import { TableParams } from '@/types/Table';

export function Users(): JSX.Element {
	const [searchValue, setSearchValue] = useState('');
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: PAGE_SIZE,
		},
	});

	const limit = Number(tableParams.pagination?.pageSize);
	const skip = (Number(tableParams.pagination?.current) - 1) * limit;

	const { data, isLoading, isPlaceholderData, isError, error } = useQuery<Pagination<Contact[]>>({
		queryKey: ['users', { limit, skip, searchValue }],
		queryFn: () => getUsers({ limit, skip, searchValue }),
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	return (
		<div className="my-8">
			<Flex justify="space-between">
				<Input.Search
					placeholder="Search for contacts"
					className="max-w-md mb-2"
					size="large"
					onChange={(e) => (e.target.value === '' ? setSearchValue('') : null)}
					onSearch={(value) => setSearchValue(value)}
					loading={searchValue !== '' && (isLoading || isPlaceholderData)}
				/>
				<ContactForm />
			</Flex>
			<ErrorBoundary isError={isError} error={error}>
				<ContactList
					tableParams={tableParams}
					setTableParams={setTableParams}
					data={data}
					isLoading={isLoading}
					isPlaceholderData={isPlaceholderData}
					searchValue={searchValue}
				/>
			</ErrorBoundary>
		</div>
	);
}
