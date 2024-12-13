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

      const initialDelta = index === 0 ? 0 : 3;

      const previewsNodeMinWidthInPx = this.molecules.reduce((prev, curr, moleculeIndex) => prev + (moleculeIndex <= index ? curr.minWidthInPx : 0), initialDelta + (index) * 6);
      const futureNodeMinWidthInPx = this.molecules.reduce((prev, curr, moleculeIndex) => prev + (moleculeIndex > index ? curr.minWidthInPx : 0), initialDelta + (this.molecules.length - index) * 6);

      const maxLeft = leftInPx + previewsNodeMinWidthInPx;
      const maxRight = leftInPx + widthInPx - futureNodeMinWidthInPx;

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

    console.log(fullWidthInPx, movementInPx, percentage);

    this.molecules = this.molecules.map((molecule, moleculeIndex) => {
      if (moleculeIndex === index) {
        return {
          ...molecule, measurements: {
            ...molecule.measurements,
            xPercentage: percentage
          }
        };
      } else if (moleculeIndex === index + 1) {
        return {
          ...molecule, measurements: {
            ...molecule.measurements,
            xPercentage: 100 - percentage
          }
        };
      } else return molecule;
    });
  }

  private checkAndUpdateMaxHeight() {
    const currentMaxHeight = this.el.nativeElement.offsetHeight;

    if (currentMaxHeight !== this.maxHeightInPx) {
      this.maxHeightInPx = currentMaxHeight;
    }
  }
}
