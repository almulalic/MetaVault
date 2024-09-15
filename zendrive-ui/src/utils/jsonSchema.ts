export function schemaToObject(schema: any, defaultValues: { [key: string]: any } = {}): any {
	if (schema.type === "object") {
		const obj: { [key: string]: any } = {};
		for (let key in schema.properties) {
			if (defaultValues.hasOwnProperty(key)) {
				obj[key] = defaultValues[key]; // Assign the default value from the object if present
			} else {
				obj[key] = schemaToObject(schema.properties[key], defaultValues); // Recursively build object
			}
		}
		return obj;
	} else if (schema.type === "array") {
		return [schemaToObject(schema.items, defaultValues)];
	} else if (schema.enum) {
		return schema.enum[0];
	} else {
		// Handle primitive types with or without default values
		const defaultValue = defaultValues[schema.name];
		if (defaultValue !== undefined) {
			return defaultValue;
		}

		switch (schema.type) {
			case "string":
				return "";
			case "integer":
			case "number":
				return 0;
			case "boolean":
				return false;
			default:
				return null;
		}
	}
}
