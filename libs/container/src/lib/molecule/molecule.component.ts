import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Molecule } from '@ngx-layout-manager/models';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'oblivion-molecule',
  imports: [CommonModule, DragDropModule],
  templateUrl: './molecule.component.html',
  styleUrl: './molecule.component.css'
})
export class MoleculeComponent {
  @Input() maxHeightFromParent: number;
  @Output() resizeDone = new EventEmitter<UIEvent>();
  @Output() dragDone = new EventEmitter<CdkDragEnd>();
  @Input({ required: true }) molecule: Molecule;
  @Input() isDragging = false;
}
