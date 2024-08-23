import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

import { useState } from 'react';

import { Button, Flex, Form, Input, Modal, notification } from 'antd';

import { createUser, updateUser } from '@/api/dummyApi';

import { Contact } from '@/types/Contact';
import { Pagination } from '@/types/Pagination';

interface ContactFormProps {
	contact?: Contact;
}

interface Values {
	id?: number;
	firstName?: string;
	lastName?: string;
	address?: string;
	city?: string;
	country?: string;
	email?: string[];
	number?: string[];
}

const ContactForm = ({ contact }: ContactFormProps) => {
	console.log('🚀 ~ ContactForm ~ contact:', contact);
	const queryClient = useQueryClient();
	const [queryKey] = queryClient
		.getQueriesData({
			type: 'active',
			queryKey: ['users'],
		})
		.flat() as QueryKey[];

	const [form] = Form.useForm();
	const [open, setOpen] = useState(false);

	const { isPending, mutate } = useMutation({
		mutationFn: contact
			? (formData: unknown) => updateUser(contact.id, formData as Contact)
			: (formData: unknown) => createUser(formData as Contact),
		onMutate: async (formData: Contact) => {
			await queryClient.cancelQueries({ queryKey: queryKey });

			const previousContacts = queryClient.getQueryData<Pagination<Contact[]>>(queryKey);

			if (previousContacts) {
				queryClient.setQueryData<Pagination<Contact[]>>(queryKey, {
					...previousContacts,
					users: contact
						? previousContacts.users.map((c) => (c.id === contact.id ? formData : c))
						: [formData, ...previousContacts.users],
				});
			}

			return { previousContacts };
		},
		onError: (error, _, context) => {
			queryClient.setQueryData(queryKey, context?.previousContacts);
			notification.error({
				message: 'Failed to delete the contact',
				description: error.message,
			});
		},
		onSuccess: () => {
			notification.success({
				message: contact ? `Contact #${contact?.id} updated successfully` : 'Contact created successfully',
			});
			setOpen(false);
		},
	});

	const onCreate = (values: Values) => {
		console.log('🚀 ~ onCreate ~ values:', values);

		mutate({
			id: contact?.id ?? Math.random(),
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email?.join(', ') ?? '',
			phone: values.number?.join(', ') ?? '',
			address: {
				address: values.address ?? '',
				city: values.city ?? '',
				country: values.country ?? '',
			},
		} as Contact);
	};

	return (
		<>
			<Button
				type={contact ? 'default' : 'primary'}
				className={contact ? '' : 'mb-2 bg-[#1677FF]'}
				size={contact ? 'middle' : 'large'}
				onClick={() => setOpen(true)}>
				{contact ? 'Edit' : 'Add contact'}
			</Button>
			<Modal
				width={800}
				open={open}
				title={contact ? 'Edit contact' : 'Create a new contact'}
				okText="Create"
				cancelText="Cancel"
				okButtonProps={{ htmlType: 'submit', className: 'bg-[#1677FF]', loading: isPending }}
				onCancel={() => {
					form.resetFields();
					setOpen(false);
				}}
				destroyOnClose
				modalRender={(dom) => (
					<Form
						disabled={isPending}
						layout="vertical"
						form={form}
						name="contact_form"
						initialValues={{
							firstName: contact?.firstName ?? '',
							lastName: contact?.lastName ?? '',
							address: contact?.address.address ?? '',
							city: contact?.address.city ?? '',
							country: contact?.address.country ?? '',
							email: contact?.email.split(', ') ?? [''],
							number: contact?.phone.split(', ') ?? [''],
						}}
						onFinish={(values: Values) => {
							onCreate(values);
							form.resetFields();
						}}>
						{dom}
					</Form>
				)}>
				<Form.Item
					name="firstName"
					label="Name"
					rules={[{ required: true, message: 'Please input the name of the contact!' }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="lastName"
					label="Last name"
					rules={[{ required: true, message: 'Please input the last name of the contact!' }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="address"
					label="Address"
					rules={[{ required: true, message: 'Please input the address of the contact!' }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="city"
					label="City"
					rules={[{ required: true, message: 'Please input the city of the contact!' }]}>
					<Input />
				</Form.Item>
				<Form.Item
					name="country"
					label="Country"
					rules={[{ required: true, message: 'Please input the country of the contact!' }]}>
					<Input />
				</Form.Item>

				<Form.List name="email">
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<Form.Item label={index === 0 ? 'Emails' : ''} required={false} key={field.key}>
									<Flex gap={8}>
										<Form.Item
											{...field}
											rules={[
												{
													required: true,
													whitespace: true,
													message:
														index === 0
															? 'Please input a email'
															: 'Please input a email or delete this field.',
												},
											]}
											noStyle>
											<Input placeholder="phone email" />
										</Form.Item>
										{fields.length > 1 ? (
											<Button
												icon={<MinusCircleOutlined className="mx-auto" />}
												className="flex justify-center items-center"
												onClick={() => remove(field.name)}></Button>
										) : null}
									</Flex>
								</Form.Item>
							))}
							<Form.Item className="flex justify-end">
								<Form.ErrorList errors={errors} />
								<Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
									Add email
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Form.List name="number">
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<Form.Item label={index === 0 ? 'Numbers' : ''} required={false} key={field.key}>
									<Flex gap={8}>
										<Form.Item
											{...field}
											rules={[
												{
													required: true,
													whitespace: true,
													message:
														index === 0
															? 'Please input a phone number'
															: 'Please input a phone number or delete this field.',
												},
											]}
											noStyle>
											<Input placeholder="phone number" />
										</Form.Item>
										{fields.length > 1 ? (
											<Button
												icon={<MinusCircleOutlined className="mx-auto" />}
												className="flex justify-center items-center"
												onClick={() => remove(field.name)}></Button>
										) : null}
									</Flex>
								</Form.Item>
							))}
							<Form.Item className="flex justify-end">
								<Form.ErrorList errors={errors} />
								<Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
									Add number
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Modal>
		</>
	);
};

export default ContactForm;
