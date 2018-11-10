import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateModule } from './template/template.module';
import { HttpClientModule } from '@angular/common/http';

//Barra de progreso
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

//INI Importando Idioma Espanol de argentina para los pipe de la app
import { registerLocaleData } from '@angular/common';
// import localeEs from '@angular/common/locales/es-CU';
import  localeEsAr  from "@angular/common/locales/es-AR";
registerLocaleData(localeEsAr, 'es-Ar');


//FIN Importando Idioma Espanol para la app
 
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TemplateModule,
    HttpClientModule,
    //Barra de progreso
    NgProgressModule.forRoot(),
    NgProgressHttpModule.forRoot()
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
