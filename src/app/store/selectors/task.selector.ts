import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Task } from 'src/app/shared/models/ITask';

export const selectTaskState = createFeatureSelector<Task[]>('tasks');

export const selectTasks = createSelector(
  selectTaskState,
  (tasks: Task[]) => tasks
);

export const selectCompletedTasks = createSelector(
  selectTasks,
  (tasks: Task[]) => tasks.filter(task => task.taskStatus === true)
);

export const selectPendingTasks = createSelector(
    selectTasks,
    (tasks: Task[]) => tasks.filter(task => task.taskStatus === false)
  );
  
