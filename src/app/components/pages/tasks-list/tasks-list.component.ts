import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ModalComponent } from 'src/app/shared/common/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Person, Task } from 'src/app/shared/models/ITask';
import { Store } from '@ngrx/store';
import { CustomValidators } from 'src/app/shared/customValidators/customValidators';
import { selectCompletedTasks, selectPendingTasks, selectTasks } from 'src/app/store/selectors/task.selector';
import { addTask, updateTask } from 'src/app/store/actions/task.action';
import { TaskService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    ModalComponent,
    MatInputModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent implements OnInit{

  @ViewChild('FormTaskModal') formTaskModal!: ModalComponent;
  isEditMode: boolean = false;
  editIndex: number | null = null;
  taskForm: FormGroup;
  tasksList: Task[] = [];


  options: Array<[string, number]> = [
    ['Completadas', 1],
    ['Pendientes', 2],
    ['Todo', 3]
  ];

  constructor(private fb: FormBuilder, 
    private dialog: MatDialog, 
    private store: Store,
    private taskService: TaskService) {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      date: ['', [Validators.required]],
      taskStatus: [false,],
      people: this.fb.array([]),
    });


  }
  ngOnInit() {

    this.tasksList = this.taskService.getTasks();
    console.log(this.taskService.getTasks());

    this.tasksList.forEach(element => {
      this.store.dispatch(addTask({ task: element }));
    });
    // this.store.select(selectTasks).subscribe(tasks => {
    //   this.tasksList = [...tasks];
    // });

  }

  editTask(task?: Task, index?: number): void {
    this.taskForm.reset();
    this.people.clear();

    if (task && typeof index === 'number') {
      this.isEditMode = true;
      this.editIndex = index;

      this.taskForm.patchValue({
        taskName: task.taskName,
        taskStatus: task.taskStatus,
        date: task.date
      });

      task.people.forEach(person => {
        this.people.push(this.initPerson(person));
      });
    } else {
      this.isEditMode = false;
      this.editIndex = null;
    }

    this.formTaskModal.openModal('70%');
  }


  initPerson(person?: Person): FormGroup {
    return this.fb.group({
      name: [person?.name || '', Validators.required],
      age: [person?.age || '', Validators.required],
      skills: this.fb.array(
        person?.skills.map(skill => this.fb.control(skill)) || []
      )
    });
  }

  deleteTask(index: number) {
    this.taskService.deleteTask(index);
   this.tasksList= this.taskService.getTasks();
  }
  filterList(option: Event) {
    const target = option.target as HTMLSelectElement;
    const value = target.value;

    if (value == '3') {
      this.store.select(selectTasks).subscribe(tasks => {
        this.tasksList = [...tasks];
      });
    } else
      if (value == '1') {
        this.store.select(selectCompletedTasks).subscribe(tasks => {
          this.tasksList = [...tasks];
        });
      } else
        if (value == '2') {
          this.store.select(selectPendingTasks).subscribe(tasks => {
            this.tasksList = [...tasks];
          });
        } else {
          this.store.select(selectTasks).subscribe(tasks => {
            this.tasksList = [...tasks];
          });
        }
  }


  updateTaskStatus(index: number, isChecked: boolean): void {
    const updatedTask = { ...this.tasksList[index], taskStatus: isChecked };

    this.tasksList = [
        ...this.tasksList.slice(0, index), 
        updatedTask, 
        ...this.tasksList.slice(index + 1)
    ];
    this.taskService.updateTask(index,this.tasksList[index])
    // this.store.dispatch(updateTask({ index: index, task: this.tasksList[index] }));

  }
  openTaskModal() {
    this.formTaskModal.openModal('70%');
  }

  closeTaskModal() {
    this.taskForm.reset();
    this.formTaskModal.closeModal();

  }

  get people(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  getSkills(i: number): FormArray {
    return this.people.at(i).get('skills') as FormArray;
  }

  addPerson() {
    var personGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), CustomValidators.nameExistsValidator(this.people.value)]],
      age: ['', [Validators.required, CustomValidators.Numeric, CustomValidators.ageValidator()]],
      skills: this.fb.array([], CustomValidators.skillValidator()),
    });

    this.people.push(personGroup);
  }

  removePerson(i: number) {
    this.people.removeAt(i);
  }

  addSkill(personIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    const skillsArray = this.getSkills(personIndex);
    if (skillsArray.length > 1) {
        skillsArray.removeAt(skillIndex);
        skillsArray.updateValueAndValidity();
    } else {
        skillsArray.setErrors({ noSkills: true });
        console.warn('No se puede eliminar la última habilidad. Debe haber al menos una habilidad.');
    }
}


  onSubmit(): void {
    this.taskForm.markAllAsTouched()
    if (this.taskForm.valid) {
      const newTaskData = { ...this.taskForm.value };

      if (this.isEditMode && this.editIndex !== null) {
        this.taskService.updateTask(this.editIndex,newTaskData)
        // this.store.dispatch(updateTask({ index: this.editIndex, task: newTaskData }));
      } else {
        this.taskService.addTask(newTaskData)
        // this.store.dispatch(addTask({ task: newTaskData }));
      }

      this.formTaskModal.closeModal()
      while (this.people.length !== 0) {
        this.people.removeAt(0);
      }
      this.isEditMode = false;
      this.editIndex = null;
      this.tasksList = this.taskService.getTasks()

      // this.store.select(selectTasks).subscribe(tasks => {
      //   this.tasksList = [...tasks];
      // });
    }
  }



}
