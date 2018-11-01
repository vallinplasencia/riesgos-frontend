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
  MatSnackBarModule
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

    MatSnackBarModule
  ],
  exports:[
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatInputModule,
    MatFormFieldModule,

    MatSnackBarModule
  ],
  declarations: []
})
export class AppMaterialModule { }
