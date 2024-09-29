import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from '../../pages/tasks-list/tasks-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,TasksListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
