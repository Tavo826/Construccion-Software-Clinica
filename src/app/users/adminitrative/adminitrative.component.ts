import { CommonModule } from '@angular/common';
import { EmergencyContact, HealthInsurance, Patient } from '../../interface/user.models';
import { Invoice } from '../../interface/invoice.models';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { ErrorComponent } from '../../shared/error/error.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HttpPatientProviderService } from '../../service/http-patient-provider.service';
import { HttpInvoiceProviderService } from '../../service/http-invoice-provider.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-adminitrative',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoadingComponent, ErrorComponent],
  templateUrl: './adminitrative.component.html',
  styleUrl: './adminitrative.component.css'
})
export class AdminitrativeComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder)
  httpPatientProvider = inject(HttpPatientProviderService)
  httpInvoiceProvider = inject(HttpInvoiceProviderService)

  constructor(private service: AuthService) {}

  activeTab: 'patients' | 'invoices' = 'patients';
  
  isLoading: boolean = true
  isEditMode: boolean = false
  isSubmitted: boolean = false;
  showErrorModal: boolean = false;
  showInvoiceModal: boolean = false;
  showPatientModal: boolean = false;

  patientList: Patient[] = []
  invoice: Invoice | null = null

  selectedPatient: Patient | null = null;
  selectedInvoice: Invoice | null = null;

  searchTerm: string = '';
  errorMessage: string = '';
  errorTitle: string = "Error administrando pacientes"

  form = this.formBuilder.group({
  documentId: [0, [Validators.required, Validators.minLength(8)]],
  name: ['', [Validators.required, Validators.minLength(3)]],
  surname: ['', [Validators.required, Validators.minLength(3)]],
  birthDate: ['', [Validators.required]],
  gender: ['', [Validators.required]],
  address: ['', [Validators.required, Validators.minLength(3)]],
  phone: [0, [Validators.required, Validators.minLength(7)]],
  email: ['', [Validators.required, Validators.email]],

  emergencyContact: this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    relationship: ['', [Validators.required, Validators.minLength(3)]],
    phone: [0, [Validators.required, Validators.minLength(7)]],
  }),

  healthInsurance: this.formBuilder.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    policyNumber: [0, [Validators.required]],
    active: [false],
    policyValidity: ['', [Validators.required]],
    policyValidityDays: [0],
  }),

  healthDetail: this.formBuilder.group({
    bloodPressure: [''],
    temperature: [''],
    pulse: [''],
    bloodOxygenLevel: [''],
  }),
});

  ngOnInit(): void {
    this.loadPatients()
  }

  loadPatients() {

    this.isLoading = true
    this.searchTerm = ''

    this.httpPatientProvider.getAllPatients().subscribe({
      next: (response) => {
        if (response != null) {
          this.patientList = response
          this.isLoading = false
        } else {
          this.patientList = []
          this.isLoading = false
        }
      },
      error: (error) => {
        this.showError(error)
        this.isLoading = false
      }
    })
  }

  findPatientById() {
  
    if (this.searchTerm.length > 7) {

      this.httpPatientProvider.getPatientById(this.searchTerm).subscribe({
        next: (response) => {
          if (response != null) {
            const filteredPatiend: Patient[] = [response]
            this.patientList = filteredPatiend
            this.isLoading = false
          } else {
            this.patientList = []
            this.isLoading = false
          }
        },
        error: (error) => {
          this.showError(error)
          this.isLoading = false
        }
      })
    }
  }

  findInvoiceByPatientId() {

    this.httpInvoiceProvider.getInvoiceByPatientId(this.selectedPatient?.documentId!).subscribe({
      next: (response) => {
        if (response != null) {
          this.invoice = response
          this.isLoading = false
        } else {
          this.isLoading = false
        }
      },
      error: (error) => {
        this.showError(error)
        this.isLoading = false
      }
    })
  }

  savePatient() {

    console.log(this.form)

    this.isSubmitted = true
    if (this.form.invalid) return

    const healthInsurance: HealthInsurance = {
      companyName: this.form.controls.healthInsurance.controls['companyName'].value!,
      policyNumber: this.form.controls.healthInsurance.controls['policyNumber'].value!,
      active: this.form.controls.healthInsurance.controls['active'].value ?? false,
      policyValidity: this.service.dateFormatter(this.form.controls.healthInsurance.controls['policyValidity'].value!),
      policyValidityDays: 0
    }

    const emergencyContact: EmergencyContact = {
      name: this.form.controls.emergencyContact.controls['name'].value!,
      surname: this.form.controls.emergencyContact.controls['surname'].value!,
      relationship: this.form.controls.emergencyContact.controls['relationship'].value!,
      phone: this.form.controls.emergencyContact.controls['phone'].value!,
    }

    const patientData: Patient = {
      documentId: this.form.controls['documentId'].value!,
      name: this.form.controls['name'].value!,
      surname: this.form.controls['surname'].value!,
      birthDate: this.service.dateFormatter(this.form.controls['birthDate'].value!),
      phone: this.form.controls['phone'].value!,
      email: this.form.controls['email'].value!,
      address: this.form.controls['address'].value!,
      age: 0,
      gender: this.form.controls['gender'].value!,
      emergencyContact: emergencyContact,
      healthInsurance: healthInsurance
    }

    if (this.isEditMode) {

      this.httpPatientProvider.updatePatient(patientData).subscribe({
        next: () => {
          this.loadPatients()
          this.closePatientModal()
          this.isSubmitted = false
          this.isLoading = false
        },
        error: (error) => {
          this.closePatientModal()
          this.showError(error)
          this.isSubmitted = false
          this.isLoading = false
        }
      })

    } else {

      this.httpPatientProvider.createPatient(patientData).subscribe({
        next: () => {
          this.loadPatients()
          this.closePatientModal()
          this.isSubmitted = false
          this.isLoading = false
        },
        error: (error) => {
          this.closePatientModal()
          this.showError(error)
          this.isSubmitted = false
          this.isLoading = false
        }
      })
    }    
  }

  openCreatePatientModal() {
    this.isEditMode = false
    this.selectedPatient = null;
    this.showPatientModal = true;
    this.form.reset()
  }

  openEditPatientModal(patient: Patient) {
    this.isEditMode = true
    this.selectedPatient = {...patient};
    this.showPatientModal = true;
    this.form.patchValue(patient)
  }

  openInvoiceModal(invoice: Invoice) {
    this.selectedInvoice = {...invoice};
    this.showInvoiceModal = true;
  }

  switchTab(tab: 'patients' | 'invoices', patient: Patient | null): void {
    this.activeTab = tab;

    if (this.activeTab == 'invoices' && patient) {
      this.selectedPatient = {...patient};
      this.findInvoiceByPatientId()
    }
    
  }

  closePatientModal() {
    this.isEditMode = false
    this.showPatientModal = false
    this.selectedPatient = null
    this.form.reset()
  }

  closeInvoiceModal() {
    this.showInvoiceModal = false
    this.selectedInvoice = null
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  logout() {
    this.service.logout()
  }

}
