import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserService } from "app/services";

@Component({
  selector: "app-user-permissions",
  templateUrl: "./user-permissions.component.html",
  styleUrls: ["./user-permissions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPermissionsComponent implements OnInit {
  public userPermForm: FormGroup;
  public recordId: string;
  public username: string;
  public inProgress: boolean;
  public errMsg: string;

  public groupAllCheck: boolean = false;
  public accountAllCheck: boolean = false;
  public inventoryAllCheck: boolean = false;
  public bankAllCheck: boolean = false;
  public genVochAllCheck: boolean = false;
  public UserAllCheck: boolean = false;
  public ProductAllCheck: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userSrvc: UserService,
    private dialogRef: MatDialogRef<UserPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userPermForm = this.fb.group({
      createAccount: this.fb.control(false),
      editAccount: this.fb.control(false),
      deleteAccount: this.fb.control(false),
      viewListAccount: this.fb.control(false),
      createInventory: this.fb.control(false),
      editInventory: this.fb.control(false),
      deleteInventory: this.fb.control(false),
      viewListInventory: this.fb.control(false),
      createGroup: this.fb.control(false),
      editGroup: this.fb.control(false),
      deleteGroup: this.fb.control(false),
      viewListGroup: this.fb.control(false),
      createGenVoucher: this.fb.control(false),
      editGenVoucher: this.fb.control(false),
      deleteGenVoucher: this.fb.control(false),
      viewListGenVoucher: this.fb.control(false),
      createUser: this.fb.control(false),
      editUser: this.fb.control(false),
      deleteUser: this.fb.control(false),
      viewListUser: this.fb.control(false),
      editUserPersmissions: this.fb.control(false),
      generateReports: this.fb.control(false),
      uploadFile: this.fb.control(false),
      createBank: this.fb.control(false),
      editBank: this.fb.control(false),
      deleteBank: this.fb.control(false),
      viewListBank: this.fb.control(false),
      createProduct: this.fb.control(false),
      viewListProduct: this.fb.control(false),
    });

    this.recordId = this.data.details._id;
    this.username = this.data.details.username;
    this.userPermForm.patchValue(this.data.details.permissions);

    this.setGroupPermission();
    this.setAccountPermission();
    this.setInventoryPermission();
    this.setBankPermission();
    this.setGenVouchPermission();
    this.setUserPermission();
    this.setProductPermission();
  }

  save() {
    this.errMsg = "";

    if (!this.userPermForm.valid) {
      return false;
    }

    this.inProgress = true;

    this.userSrvc
      .updatePersmission(this.recordId, this.userPermForm.value)
      .subscribe(
        (resp) => {
          this.inProgress = false;
          this.dialogRef.close("saved");
        },
        (error) => {
          this.inProgress = false;
          this.errMsg = error;
          return false;
        }
      );
  }

  setGroupAllPermissions(checkAll: boolean) {
    this.groupAllCheck = checkAll;

    this.userPermForm.patchValue({
      createGroup: checkAll,
      editGroup: checkAll,
      deleteGroup: checkAll,
      viewListGroup: checkAll
    });
  }

  setGroupPermission() {
    this.groupAllCheck =
      this.userPermForm.get("createGroup").value &&
      this.userPermForm.get("editGroup").value &&
      this.userPermForm.get("deleteGroup").value &&
      this.userPermForm.get("viewListGroup").value;
  }

  setAccountAllPermissions(checkAll: boolean) {
    this.accountAllCheck = checkAll;

    this.userPermForm.patchValue({
      createAccount: checkAll,
      editAccount: checkAll,
      deleteAccount: checkAll,
      viewListAccount: checkAll
    });
  }

  setAccountPermission() {
    this.accountAllCheck =
      this.userPermForm.get("createAccount").value &&
      this.userPermForm.get("editAccount").value &&
      this.userPermForm.get("deleteAccount").value &&
      this.userPermForm.get("viewListAccount").value;
  }

  setInventoryAllPermissions(checkAll: boolean) {
    this.inventoryAllCheck = checkAll;

    this.userPermForm.patchValue({
      createInventory: checkAll,
      editInventory: checkAll,
      deleteInventory: checkAll,
      viewListInventory: checkAll
    });
  }

  setInventoryPermission() {
    this.inventoryAllCheck =
      this.userPermForm.get("createInventory").value &&
      this.userPermForm.get("editInventory").value &&
      this.userPermForm.get("deleteInventory").value &&
      this.userPermForm.get("viewListInventory").value;
  }

  setBankAllPermissions(checkAll: boolean) {
    this.bankAllCheck = checkAll;

    this.userPermForm.patchValue({
      createBank: checkAll,
      editBank: checkAll,
      deleteBank: checkAll,
      viewListBank: checkAll
    });
  }

  setBankPermission() {
    this.bankAllCheck =
      this.userPermForm.get("createBank").value &&
      this.userPermForm.get("editBank").value &&
      this.userPermForm.get("deleteBank").value &&
      this.userPermForm.get("viewListBank").value;
  }

  setGenVouchAllPermissions(checkAll: boolean) {
    this.genVochAllCheck = checkAll;

    this.userPermForm.patchValue({
      createGenVoucher: checkAll,
      editGenVoucher: checkAll,
      deleteGenVoucher: checkAll,
      viewListGenVoucher: checkAll
    });
  }

  setGenVouchPermission() {
    this.genVochAllCheck =
      this.userPermForm.get("createGenVoucher").value &&
      this.userPermForm.get("editGenVoucher").value &&
      this.userPermForm.get("deleteGenVoucher").value &&
      this.userPermForm.get("viewListGenVoucher").value;
  }

  setUserAllPermissions(checkAll: boolean) {
    this.UserAllCheck = checkAll;

    this.userPermForm.patchValue({
      createUser: checkAll,
      editUser: checkAll,
      deleteUser: checkAll,
      viewListUser: checkAll,
      editUserPersmissions: checkAll
    });
  }

  setUserPermission() {
    this.UserAllCheck =
      this.userPermForm.get("createUser").value &&
      this.userPermForm.get("editUser").value &&
      this.userPermForm.get("deleteUser").value &&
      this.userPermForm.get("viewListUser").value &&
      this.userPermForm.get("editUserPersmissions").value;
  }

  setProductAllPermissions(checkAll: boolean) {
    this.ProductAllCheck = checkAll;

    this.userPermForm.patchValue({
      createProduct: checkAll,
      viewListProduct: checkAll
    });
  }

  setProductPermission() {
    this.ProductAllCheck =
      this.userPermForm.get("createProduct").value &&
      this.userPermForm.get("viewListProduct").value;
  }
}
