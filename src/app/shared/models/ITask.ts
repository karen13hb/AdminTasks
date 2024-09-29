export interface Task {
    taskName: string;
    date:string;
    taskStatus:boolean;
    people: Array<Person>;
}

export interface Person {
    name: string;
    age: number;
    skills: Array<string>;
}