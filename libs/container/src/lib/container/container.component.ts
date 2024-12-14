import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input
} from '@angular/core';
import { MoleculeComponent } from '../molecule/molecule.component';
import { CDK_DRAG_CONFIG, CdkDragMove, DragDropModule, DragRef, DragRefConfig, Point } from '@angular/cdk/drag-drop';
import { Molecule } from '@ngx-layout-manager/models';
import { IsSingleMoleculePipe } from '../is-single-molecule/is-single-molecule.pipe';
import { CommonModule } from '@angular/common';
import { sum } from 'lodash';

const DragConfig: DragRefConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};

@Component({
  selector: 'oblivion-container',
  templateUrl: './container.component.html',
  styleUrl: './container.component.less',
  imports: [DragDropModule, IsSingleMoleculePipe, MoleculeComponent, CommonModule],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent implements AfterViewChecked, AfterContentInit {
  @Input() molecules: Molecule[];
  @Input() isSubContainer = false;

  maxHeightInPx: number;
  @Input() isDragging = false;

  constructor(private el: ElementRef<HTMLElement>) {
    this.checkAndUpdateMaxHeight();
  }

  constrainDrag(index: number) {
    return (userPointerPosition: Point, dragRef: DragRef, dimensions: DOMRect, pickupPositionInElement: Point) => {
      const leftInPx = this.el.nativeElement.offsetLeft;
      const widthInPx = this.el.nativeElement.offsetWidth;

      const previewsNodeMinWidthInPx = this.molecules.reduce((prev, curr, moleculeIndex) => prev + (moleculeIndex <= index ? curr.minWidthInPx : 0), (index) * 7);
      const futureNodeMinWidthInPx = this.molecules.reduce((prev, curr, moleculeIndex) => prev + (moleculeIndex > index ? curr.minWidthInPx : 0), (this.molecules.length - (index + 1)) * 7);

      const maxLeft = leftInPx + previewsNodeMinWidthInPx;
      const maxRight = leftInPx + widthInPx - futureNodeMinWidthInPx;

      console.log(leftInPx, widthInPx, previewsNodeMinWidthInPx, futureNodeMinWidthInPx, maxLeft, maxRight, (this.molecules.length - index) * 7);

      if (userPointerPosition.x <= maxLeft) {
        return {
          ...userPointerPosition,
          x: maxLeft
        };
      } else if (userPointerPosition.x >= maxRight) {
        return {
          ...userPointerPosition,
          x: maxRight
        };
      }


      return userPointerPosition;
    };
  }

  ngAfterContentInit() {
    this.checkAndUpdateMaxHeight();
  }

  ngAfterViewChecked() {
  }

  moleculeById(index: number, molecule: Molecule) {
    return molecule.id;
  }

  onLineMove(moveEvent: CdkDragMove, index: number) {
    const fullWidthInPx = this.el.nativeElement.offsetWidth;
    const movementInPx = moveEvent.pointerPosition.x - this.el.nativeElement.offsetLeft;

    const percentage = (movementInPx * 100) / fullWidthInPx;

    this.molecules = this.molecules.map((molecule, moleculeIndex) => {
      if (moleculeIndex === index) {
        return {
          ...molecule, measurements: {
            ...molecule.measurements,
            xPercentage: percentage
          }
        };
      } else {
        const b = (100 - percentage) * (molecule.measurements.xPercentage / this.molecules.filter((_,currIndex)=>currIndex !== index).reduce((prev, curr) => prev + curr.measurements.xPercentage, 0));
        console.log(b);

        return {
          ...molecule,
          measurements: {
            ...molecule.measurements,
            xPercentage: b
          }
        };
      }
    });
    console.log(this.molecules.map(({ measurements }) => measurements.xPercentage), sum(this.molecules.map(({ measurements }) => measurements.xPercentage)));
  }

  private checkAndUpdateMaxHeight() {
    const currentMaxHeight = this.el.nativeElement.offsetHeight;

    if (currentMaxHeight !== this.maxHeightInPx) {
      this.maxHeightInPx = currentMaxHeight;
    }
  }
}
