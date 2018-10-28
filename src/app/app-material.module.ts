import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import { 
  MatToolbarModule, 
  MatButtonModule, 
  MatSidenavModule, 
  MatIconModule, 
  MatListModule,
  MatInputModule,
  MatFormFieldModule
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
  ],
  exports:[
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    MatInputModule,
    MatFormFieldModule
  ],
  declarations: []
})
export class AppMaterialModule { }
