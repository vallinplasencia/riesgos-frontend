import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categoria-nueva',
  templateUrl: './categoria-nueva.component.html',
  styleUrls: ['./categoria-nueva.component.css']
})
export class CategoriaNuevaComponent implements OnInit {

  categoriaForm = this.fb.group({
    ident: ['', Validators.required],
    categoria: ['', Validators.required]
  });
  // url$: Observable<string>;
  url: string;
  constructor(private fb: FormBuilder, private router:Router) { }

  ngOnInit() {
    // this.url$ = this.route.url
    // .pipe(
    //   map(segments => segments.join(''))
    // );
    this.url = this.router.routerState.snapshot.url;
  }

}
