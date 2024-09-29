// task.reducer.ts
import { createReducer, on } from '@ngrx/store';

import { Task } from 'src/app/shared/models/ITask';
import { addTask,updateTask,deleteTask } from '../actions/task.action';


export const initialState: Task[] = [];

const _taskReducer = createReducer(
  initialState,
  on(addTask, (state, { task }) => [...state, task]),
  on(updateTask, (state, { index, task }) => state.map((t, i) => i === index ? task : t)),
  on(deleteTask, (state, { index }) => state.filter((_, i) => i !== index))
);

export function taskReducer(state: Task[] | undefined, action: any) {
  return _taskReducer(state, action);
}
