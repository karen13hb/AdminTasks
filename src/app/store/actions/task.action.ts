import { createAction, props } from '@ngrx/store';
import { Task } from 'src/app/shared/models/ITask';


export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update Task', props<{ index: number, task: Task }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ index: number }>());
