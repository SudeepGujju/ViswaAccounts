import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserDetailsDialogComponent } from './user-details/user-details-dialog.component';
import { UserPermissionDialogComponent } from './user-permissions/user-permisssion-dialog.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { SharedDirectives } from 'app/utils/number-only.directive';


@NgModule({
  declarations: [
    UsersListComponent,
    UserDetailsComponent,
    UserDetailsDialogComponent,
    UserPermissionsComponent,
    UserPermissionDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedDirectives,
    UsersRoutingModule
  ],
  entryComponents: [UserDetailsComponent, UserPermissionsComponent]
})
export class UsersModule { }
