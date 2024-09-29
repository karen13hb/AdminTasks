import { Injectable } from '@angular/core';
import { Task } from '../models/ITask';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private localStorageKey = 'tasksList';

  constructor() {}

  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.localStorageKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }


  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }


  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }


  updateTask(index: number, updatedTask: Task): void {
    const tasks = this.getTasks();
    tasks[index] = updatedTask;
    this.saveTasks(tasks);
  }

  deleteTask(index: number): void {
    const tasks = this.getTasks();
    tasks.splice(index, 1);
    this.saveTasks(tasks);
  }

  clearTasks(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
