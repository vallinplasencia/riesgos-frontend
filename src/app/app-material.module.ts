import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,

  MatIconModule,
  MatListModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,

  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatProgressSpinnerModule,

} from '@angular/material';

@NgModule({
  imports: [
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatInputModule,
    MatFormFieldModule,

    MatSnackBarModule,

    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatInputModule,
    MatFormFieldModule,

    MatSnackBarModule,

    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  declarations: []
})
export class AppMaterialModule { }
