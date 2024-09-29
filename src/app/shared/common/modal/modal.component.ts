import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  
  @Input() title = '';
  @ViewChild('Dialog', { read: TemplateRef }) dialog!: TemplateRef<any>;

  constructor(
    private dialogService: MatDialog) { }

  openModal(width?: string) {
    this.dialogService.open(this.dialog, { disableClose: true, width: width });
  }

  closeModal() {
    this.dialogService.closeAll();
  }

}
