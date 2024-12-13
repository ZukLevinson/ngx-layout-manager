import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContainerComponent, MoleculeComponent } from '@oblivion/container';
import { Molecule } from '@ngx-layout-manager/models';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule, ContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'client';
  molecules: Molecule[] = [];

  constructor() {
    this.molecules = [{
      id: '1',
      isFixed: false,
      minWidthInPx: 247,
      minHeightInPx: 300,
      measurements: {
        xPercentage: 30
      }
    },
      {
        id: '2',
        isFixed: false,
        minWidthInPx: 496,
        minHeightInPx: 300,
        measurements: {
          xPercentage: 40
        },
        molecules: [
          {
            id: '2A',
            isFixed: false,
            minWidthInPx: 247,
            minHeightInPx: 300,
            measurements: {
              xPercentage: 50
            }
          },
          {
            id: '2B',
            isFixed: false,
            minWidthInPx: 247,
            minHeightInPx: 300,
            measurements: {
              xPercentage: 50
            }
          }
        ]
      },
      {
        id: '3',
        isFixed: false,
        minWidthInPx: 247,
        minHeightInPx: 300,
        measurements: {
          xPercentage: 30
        }
      }
    ];
  }
}
