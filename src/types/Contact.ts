export interface Contact {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: {
		address: string;
		city: string;
		state: string;
		stateCode: string;
		postalCode: string;
		coordinates: {
			lat: number;
			lng: number;
		};
		country: string;
	};
}
