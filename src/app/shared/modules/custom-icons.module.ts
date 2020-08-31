import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [],
  imports: [],
  exports: []
})
export class CustomIconsModule {
  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon('group',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/images/dashboard/group.svg')
    );

  }
}
