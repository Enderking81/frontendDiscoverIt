import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DropdownComponent } from '../dropdown-menu/dropdown-menu.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DropdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    DropdownComponent
  ]
})
export class UiModule { }
