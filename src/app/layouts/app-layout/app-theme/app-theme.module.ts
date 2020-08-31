import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItemsComponent} from './menu-items/menu-items.component';
import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './menu-accordion';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    MenuItemsComponent,
    AccordionDirective,
    AccordionAnchorDirective,
    AccordionLinkDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    MenuItemsComponent,
    AccordionDirective,
    AccordionAnchorDirective,
    AccordionLinkDirective,
  ]
})
export class AppThemeModule {
}
