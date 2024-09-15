export class UpdateUserDto {
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;

	constructor(firstName: string, lastName: string, displayName: string, email: string) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.displayName = displayName;
		this.email = email;
	}
}
