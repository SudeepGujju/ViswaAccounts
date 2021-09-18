import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { GeneralVoucher, Account } from '../../../data-model';
import { AlertService } from '../../alert';
import { AuthService, GeneralVouchersService } from '../../../services';
import { DateValidator } from '../../../utils/date-validate';
import { getDefaultDate } from '../../../utils/number-only.directive';
import { Constants } from 'app/constants';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-gen-voucher-details',
  templateUrl: './gen-voucher-details.component.html',
  styleUrls: ['./gen-voucher-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenVoucherDetailsComponent implements OnInit {
  @ViewChildren('firmName') firmNameFldsList!: QueryList<ElementRef>;
  @ViewChildren('code') codeFldsList!: QueryList<MatInput>;

  public genVouchDtlsForm: FormGroup;
  public pageMode = '';
  public isCreateMode = false;
  filteredOptions: Observable<Account[]>[] = [];

  public defaultAmount = '0.00';
  public defaultDate = getDefaultDate();
  private shopsList: Account[] = [];
  public inProgress = false;
  private removedVoucherIds: string[] = [];

  constructor(
    public fb: FormBuilder,
    private genVouchSrvc: GeneralVouchersService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private dialogRef: MatDialogRef<GenVoucherDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.pageMode = Constants.PageModeMapping(this.data.pageMode);

    if (this.data.pageMode === Constants.PAGE_MODE.CREATE) {
      this.isCreateMode = true;
    }

    this.shopsList = this.data.accountList;

    this.genVouchDtlsForm = this.fb.group({
      _id: [''],
      No: [
        this.data.generalVoucherNumber,
        [Validators.required, Validators.maxLength(50)],
      ],
      date: [
        this.defaultDate,
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      vouchList: this.fb.array([]),
      totDbAmt: [this.defaultAmount, Validators.maxLength(15)],
      totCrAmt: [this.defaultAmount, Validators.maxLength(15)],
    });

    if (!this.isCreateMode) {
      const listSize = this.data.details.vouchList.length;

      for (let i = 0; i < listSize; i++) {
        this.addRecord(false);
      }

      setTimeout(() => {
        this.genVouchDtlsForm.patchValue(this.data.details);

        const firmNameArr = this.firmNameFldsList.toArray();
        this.vouchList.controls.forEach((group: FormGroup, index) => {
          this.validateNSetCode(
            group.get('code').value,
            group.get('code') as FormControl,
            firmNameArr[index].nativeElement
          );
        });
      });
    } else {
      this.addRecord(false);
    }
  }

  get No() {
    return this.genVouchDtlsForm.get('No') as FormControl;
  }
  get date() {
    return this.genVouchDtlsForm.get('date') as FormControl;
  }
  get vouchList() {
    return this.genVouchDtlsForm.get('vouchList') as FormArray;
  }
  get totDbAmt() {
    return this.genVouchDtlsForm.get('totDbAmt') as FormControl;
  }
  get totCrAmt() {
    return this.genVouchDtlsForm.get('totCrAmt') as FormControl;
  }

  getNewListFormGroup(): FormGroup {
    const arrayControl = this.fb.group({
      _id: [''],
      code: ['', [Validators.required, Validators.maxLength(10)]],
      desc: ['', [Validators.required, Validators.maxLength(50)]],
      dbAmt: [this.defaultAmount, Validators.maxLength(15)],
      crAmt: [this.defaultAmount, Validators.maxLength(15)],
    });

    return arrayControl;
  }

  addRecord(focusField: boolean) {
    this.vouchList.push(this.getNewListFormGroup());
    this.manageAutoComplete(this.vouchList.controls.length - 1);

    if (focusField) {
      setTimeout(() => {
        this.codeFldsList.last.focus();
      }, 0);
    }
  }

  removeRecord(index: number) {
    if (!this.isCreateMode) {
      const id = ((this.vouchList.at(index) as FormGroup).get(
        '_id'
      ) as FormControl).value;

      if (id.length > 0) {
        this.removedVoucherIds.push(id);
      }
    }

    this.vouchList.removeAt(index);
    this.updateTotalAmount();

    setTimeout(() => {
      this.codeFldsList.last.focus();
    }, 0);
  }

  updateTotalAmount() {
    let totalDbAmt = 0.0;
    let totalCrAmt = 0.0;

    this.vouchList.controls.forEach((group: FormGroup) => {
      totalDbAmt += this.getNumberValue(
        (group.get('dbAmt') as FormControl).value
      );
      totalCrAmt += this.getNumberValue(
        (group.get('crAmt') as FormControl).value
      );
    });

    this.totDbAmt.setValue(totalDbAmt.toFixed(2));
    this.totCrAmt.setValue(totalCrAmt.toFixed(2));
  }

  resetValue(control: FormControl) {
    control.setValue(this.defaultAmount);
  }

  private getNumberValue(value): number {
    if (value && !isNaN(value)) {
      return +parseFloat(value).toFixed(2);
    } else {
      return 0.0;
    }
  }

  manageAutoComplete(index: number) {
    this.filteredOptions[index] = this.vouchList
      .at(index)
      .get('code')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => (value ? this._filter(value) : this.shopsList.slice()))
      );
  }

  validateNSetCode(
    code: string,
    control: FormControl,
    firmNameFld: HTMLInputElement
  ) {
    firmNameFld.value = '';

    if (code) {
      const shop = this.shopsList.find(
        (x) => x.code.toLowerCase() === code.toLowerCase()
      );
      if (shop) {
        firmNameFld.value = shop.firmName;
        return;
      }
    }

    control.setErrors({ InvalidCode: true });
  }

  private _filter(value: string): Account[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(
      (shop) =>
        shop.firmName.toLowerCase().includes(filterValue) ||
        shop.code.toLowerCase().includes(filterValue)
    );
  }

  save() {
    if (!this.genVouchDtlsForm.valid) {
      return false;
    }

    if (
      this.getNumberValue(this.totDbAmt.value) !==
      this.getNumberValue(this.totCrAmt.value)
    ) {
      this.totDbAmt.setErrors({ UnequalAmt: true });
      this.totCrAmt.setErrors({ UnequalAmt: true });
      return false;
    }

    if (this.isCreateMode) {
      this.createGenVoucher();
    } else {
      this.editGenVoucher();
    }
  }

  createGenVoucher() {
    this.inProgress = true;

    const genVoucher: GeneralVoucher = Object.assign(
      {},
      this.genVouchDtlsForm.value
    );

    delete genVoucher._id;

    genVoucher.vouchList.forEach((x) => delete x._id);

    this.genVouchSrvc.save(genVoucher).subscribe(
      (resp) => {
        this.inProgress = false;

        this.alrtSrvc
          .showSuccessAlert(resp)
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close();
            this.genVouchSrvc.notifyToUpdateList();
          });
      },
      (error) => {
        this.inProgress = false;
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  editGenVoucher() {
    this.inProgress = true;

    const genVoucher: GeneralVoucher = Object.assign(
      {},
      this.genVouchDtlsForm.value
    );

    const recordID = genVoucher._id;

    delete genVoucher._id;

    genVoucher.removedVoucherIds = this.removedVoucherIds;

    this.genVouchSrvc.update(recordID, genVoucher).subscribe(
      (resp) => {
        this.inProgress = false;

        this.alrtSrvc
          .showSuccessAlert(resp)
          .afterClosed()
          .subscribe(() => {
            this.dialogRef.close();
            this.genVouchSrvc.notifyToUpdateList();
          });
      },
      (error) => {
        this.inProgress = false;
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }
}
