import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentModule} from 'ngx-moment';
import {IfMatchDirective} from './directives/if-match.directive';
import {LightboxModule} from 'ngx-lightbox';
import {SocketIoModule} from 'ngx-socket-io';
import {DigitOnlyDirective} from './directives/digits-only.directive';
import {CustomIconsModule} from './modules/custom-icons.module';
import {TsMatPaginationComponent} from './directives/ts-mat-pagination/ts-mat-pagination.component';
import {NotFoundComponent} from '../not-found/not-found.component';
import {TsNoDataCardComponent} from './directives/ts-no-data-card/ts-no-data-card.component';
import {ShortNumberPipe} from './pipes/short-number.pipe';
import {SafeStyleUrlPipe} from './pipes/safeStyleUrl.pipe';
import {TsDisplayFormErrorsComponent} from './directives/ts-display-form-errors/ts-display-form-errors.component';
import {MustMatchDirective} from './directives/must-match.directive';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ToastaModule} from 'ngx-toasta';
import {NetworkStatusAngularModule} from 'network-status-angular';
import {HttpClientModule} from '@angular/common/http';
import {TextNormalizePipe} from './pipes/textNormalize.pipe';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {TsConfirmationAlertModule} from './directives/ts-confirmation-alert/ts-confirmation-alert.module';
import {TsMultiOptionsAlertModule} from './directives/ts-multi-options-alert/ts-multi-options-alert.module';
import {TsFileDropZoneModule} from './directives/ts-file-drop-zone/ts-file-drop-zone.module';
import {Ng2GoogleChartsModule} from 'ng2-google-charts';
import {TsMultiSelectDropdownModule} from './directives/ts-multi-select-dropdown/ts-multi-select-dropdown.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {EncodeDayTimeToNumberPipe} from './pipes/encodeDayTimeToNumber.pipe';
import {DecodeDayTimeFromNumberPipe} from './pipes/decodeDayTimeFromNumber.pipe';
import {MatMomentDateModule, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatMomentDatetimeModule} from '@mat-datetimepicker/moment';
import {MatDatetimepickerModule} from '@mat-datetimepicker/core';
import {TsCalendarComponent} from './directives/ts-calendar/ts-calendar.component';


export const TS_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    DigitOnlyDirective,
    MustMatchDirective,
    IfMatchDirective,

    TextNormalizePipe,
    SafeHtmlPipe,
    SafeStyleUrlPipe,
    ShortNumberPipe,
    EncodeDayTimeToNumberPipe,
    DecodeDayTimeFromNumberPipe,

    NotFoundComponent,
    TsMatPaginationComponent,
    TsNoDataCardComponent,
    TsDisplayFormErrorsComponent,
    TsCalendarComponent,
  ],
  imports: [
    CustomIconsModule,
    TsConfirmationAlertModule,
    TsMultiOptionsAlertModule,
    TsFileDropZoneModule,
    TsMultiSelectDropdownModule,

    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkStatusAngularModule.forRoot(),
    ToastaModule.forRoot(),
    SocketIoModule,
    HttpClientModule,
    LightboxModule,
    MomentModule,
    RouterModule,
    Ng2GoogleChartsModule,
    MatMomentDateModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,

    // Material imports
    MatBottomSheetModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRippleModule,
  ],
  exports: [
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NetworkStatusAngularModule,
    SocketIoModule,
    ToastaModule,
    HttpClientModule,
    LightboxModule,
    MomentModule,

    // Material Imports
    MatBottomSheetModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRippleModule,

    NgxMaterialTimepickerModule,
    Ng2GoogleChartsModule,
    MatMomentDateModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,

    // custom
    CustomIconsModule,

    TextNormalizePipe,
    ShortNumberPipe,
    SafeHtmlPipe,
    SafeStyleUrlPipe,
    EncodeDayTimeToNumberPipe,
    DecodeDayTimeFromNumberPipe,

    NotFoundComponent,
    TsMatPaginationComponent,
    TsNoDataCardComponent,
    TsDisplayFormErrorsComponent,
    TsCalendarComponent,

    DigitOnlyDirective,
    MustMatchDirective,
    IfMatchDirective,
    TsConfirmationAlertModule,
    TsMultiOptionsAlertModule,
    TsFileDropZoneModule,
    TsMultiSelectDropdownModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: TS_DATE_FORMATS},
  ]
})
export class SharedModule {

}
