import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ts-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  @Input() backUrl = '/';

  constructor() {
  }

  ngOnInit() {
  }

}
