class SearchDTO {
    name?: String;
    id?: String;
    breadcrumbs?: String[];


    constructor(name: String, id: String, breadcrumbs: String[]) {
        this.name = name;
        this.id = id;
        this.breadcrumbs = breadcrumbs;
    }
}
