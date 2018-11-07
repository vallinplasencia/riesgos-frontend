import { Component, OnInit, Input } from '@angular/core';
import { Errorr } from '../../acceso-datos/util/entidades/errorr';

@Component({
  selector: 'app-error-mensajes-modelo',
  templateUrl: './error-mensajes-modelo.component.html',
  styleUrls: ['./error-mensajes-modelo.component.css']
})
export class ErrorMensajesModeloComponent implements OnInit {

  @Input() errores: Errorr;
  
  constructor() { 
  }

  ngOnInit() {
  }

}
