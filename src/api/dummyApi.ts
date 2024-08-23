import { SELECTED_USER_KEYS } from '@/lib/constants';

import { Contact } from '@/types/Contact';

const apiUrl = import.meta.env.VITE_API_URL as string;

export const getUsers = async ({ limit, skip, searchValue }: { limit: number; skip: number; searchValue: string }) => {
	const params = new URLSearchParams({
		q: searchValue,
		skip: skip.toString(),
		limit: limit.toString(),
		select: SELECTED_USER_KEYS.toString(),
	});
	const searching = searchValue !== '';
	const response = await fetch(`${apiUrl}/users${searching ? '/search' : ''}?${params.toString()}`);
	return response.json();
};

export const deleteUser = async (userId: Contact['id']) => {
	const response = await fetch(`${apiUrl}/users/${userId}`, {
		method: 'DELETE',
	});
	return response.json();
};

export const createUser = async (data: Contact) => {
	const response = await fetch(`${apiUrl}/users/add`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return response.json();
};

export const updateUser = async (userId: Contact['id'], data: Contact) => {
	const response = await fetch(`${apiUrl}/users/${userId}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return response.json();
};
