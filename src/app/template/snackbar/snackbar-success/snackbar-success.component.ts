import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-snackbar-success',
  templateUrl: './snackbar-success.component.html',
  styleUrls: ['./snackbar-success.component.css']
})
export class SnackbarSuccessComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
