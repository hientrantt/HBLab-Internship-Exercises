const TODO = 0;
const COMPLETED = 1;

class Task{
    constructor(title, description, category, date, status){
        this.title = title;
        this.description = description;
        this.category = category;
        this.date = date;
        this.status = status;
    }
}