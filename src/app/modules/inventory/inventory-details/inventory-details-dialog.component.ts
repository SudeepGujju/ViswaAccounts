import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from 'app/constants';
import { InventoryDetailsComponent } from './inventory-details.component';

@Component({
  template: ''
})
export class InventoryDetailsDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    if (this.route.snapshot.data.pageMode === Constants.PAGE_MODE.CREATE) {
      this.openCreateDialog();
    } else {
      this.openEditDialog();
    }
  }

  public openCreateDialog() {

    const dialogRef = this.dialog.open(InventoryDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: Constants.PAGE_MODE.CREATE,
        accountList: this.route.snapshot.data.accountList
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null } }]);
    });
  }

  public openEditDialog() {
    const dialogRef = this.dialog.open(InventoryDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: Constants.PAGE_MODE.EDIT,
        details: this.route.snapshot.data.details,
        accountList: this.route.snapshot.data.accountList
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null } }]);
    });
  }
}
