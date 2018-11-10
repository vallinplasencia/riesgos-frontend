import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

//Moment
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
//Fin Moment

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

  MatDatepickerModule,
  MatNativeDateModule,

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

    MatDatepickerModule,
    MatNativeDateModule,
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

    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [],
  providers: [
    //Provider de moment

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },//dd-mm-yyyyFormato de fecha de Material DatePicker

    //FIN Provider de moment
  ],
})
export class AppMaterialModule { }
