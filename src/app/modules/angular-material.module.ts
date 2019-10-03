import { NgModule } from '@angular/core';
import {
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule { }
