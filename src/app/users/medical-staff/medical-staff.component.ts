import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { ErrorComponent } from '../../shared/error/error.component';
import { HttpPatientProviderService } from '../../service/http-patient-provider.service';
import { AuthService } from '../../shared/auth/auth.service';
import { Patient } from '../../interface/user.models';
import { Order, OrderDiagnosticAssistance, OrderMedicine, OrderProcedure } from '../../interface/order.models';
import { RecordRequest, RecordResponse } from '../../interface/record.model';
import { HttpOrderProviderService } from '../../service/http-order-provider.service';
import { HttpRecordProviderService } from '../../service/http-record-provider.service';

@Component({
  selector: 'app-medical-staff',
  imports: [ReactiveFormsModule, LoadingComponent, CommonModule, FormsModule, ErrorComponent, KeyValuePipe, DatePipe],
  templateUrl: './medical-staff.component.html',
  styleUrl: './medical-staff.component.css'
})
export class MedicalStaffComponent {

  private readonly formBuilder = inject(FormBuilder)
  httpOrderProvider = inject(HttpOrderProviderService)
  httpPatientProvider = inject(HttpPatientProviderService)
  httpRecordProvider = inject(HttpRecordProviderService)

  constructor(private service: AuthService) {}

  isLoading: boolean = false
  isSubmitted: boolean = false
  showErrorModal: boolean = false
  showProcedureModal: boolean = false
  showDiagnosticModal: boolean = false
  showMedicationModal: boolean = false

  searchTerm: string = ''
  errorMessage: string = '';
  errorTitle: string = "Error administrando pacientes"
  activeDetailTab: 'clinical_info' | 'diagnostics' | 'medications' | 'procedures' | 'history' = 'clinical_info'

  newOrder: Order | null = null
  selectedOrder: Order | null = null
  selectedPatient: Patient | null = null
  selectedRecord: RecordResponse | null = null

  recordForm = this.formBuilder.group({
    employeeId: [0, [Validators.required, Validators.minLength(8)]],
    reason: ['', [Validators.required, Validators.minLength(3)]],
    symptomatology: ['', [Validators.required, Validators.minLength(3)]],
    diagnosis: ['', [Validators.required, Validators.minLength(3)]],
    date: ""
  })

  medicationForm = this.formBuilder.group({
    medicineName: ['', [Validators.required, Validators.minLength(3)]],
    dose: ['', [Validators.required, Validators.minLength(3)]],
    treatmentDuration: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required]],
  })

  diagnosticAssistanceForm = this.formBuilder.group({
    diagnosticAssistanceName: ['', [Validators.required, Validators.minLength(3)]],
    quantity: ['', [Validators.required, Validators.minLength(3)]],
    requiresSpecialistAssistance: [false],
    specialistId: [0, [Validators.required, Validators.minLength(8)]],
    price: ['', [Validators.required]],
  })

  procedureForm = this.formBuilder.group({
    procedureName: ['', [Validators.required, Validators.minLength(3)]],
    repetitionNumber: [0, [Validators.required]],
    repetitionFrequency: ["", [Validators.required, Validators.minLength(3)]],
    requiresSpecialistAssistance: [false],
    specialistId: [0, [Validators.required, Validators.minLength(8)]],
    price: ['', [Validators.required]],

    healthDetail: this.formBuilder.group({
      bloodPressure: ['', [Validators.required]],
      temperature: ['', [Validators.required]],
      pulse: ['', [Validators.required]],
      bloodOxygenLevel: ['', [Validators.required]],
    })
  })

  switchDetailTab(tab: 'clinical_info' | 'diagnostics' | 'medications' | 'procedures' | 'history'): void {
    this.activeDetailTab = tab;
  }

  findPatientById() {

    console.log("Buscando paciente por id")

    this.isLoading = true
  
    if (this.searchTerm.length > 7) {

      this.httpPatientProvider.getPatientById(this.searchTerm).subscribe({
        next: (response) => {
          if (response != null) {
            console.log("Paciente: ", response)
            this.selectedPatient = response
            this.getOrderByPatientId(this.selectedPatient.documentId)
            this.getRecordByPatientId(this.selectedPatient.documentId)
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

    this.isLoading = false
  }

  getOrderByPatientId(documentId: number) {

    console.log("Obteniendo orden para: ", documentId)

    this.httpOrderProvider.getOrderByPatientId(documentId).subscribe({
      next: (response) => {
        if (response != null) {
          if (
            response.orderDiagnosticAssistanceList.length == 0 &&
            response.orderMedicineList.length == 0 &&
            response.orderProcedureList.length == 0
          ) {
            this.initializeNewOrder(this.selectedPatient?.documentId!)
            this.isLoading = false
          } else {
            console.log("Order: ", response)
            this.selectedOrder = response
            this.isLoading = false
          }
          
        }
      },
      error: (error) => {
        this.showError(error)
        this.isLoading = false
      }
    })
  }

  initializeNewOrder(documentId: number) {

    console.log("Creando nueva orden: ", documentId)

    const randomValue = Math.floor(Math.random() * (99999 - 10000 + 1)) + 1000

    this.newOrder = {
      orderNumber: randomValue.toString(),
      patientId: documentId,
      employeeId: 0,
      orderDiagnosticAssistanceList: [],
      orderMedicineList: [],
      orderProcedureList: [],
      creationDate: ""
    }

    if (!this.selectedOrder) {
      this.selectedOrder = {
        orderNumber: this.newOrder.orderNumber,
        patientId: documentId,
        employeeId: 0,
        orderDiagnosticAssistanceList: [],
        orderMedicineList: [],
        orderProcedureList: [],
        creationDate: ""
      }
    }
    
  }

  saveOrderMedication() {

    console.log("Guardando orden medicamento")
    
    this.isSubmitted = true

    if (this.medicationForm.valid && this.selectedOrder) {
      const medication: OrderMedicine = {
        itemNumber: 0,
        medicineName: this.medicationForm.value.medicineName!,
        dose: this.medicationForm.value.dose!,
        treatmentDuration: this.medicationForm.value.treatmentDuration!,
        price: this.medicationForm.value.price!,
        creationDate: ''
      }

      console.log("selected order: ", this.selectedOrder)
      console.log("new order: ", this.newOrder)

      if (this.newOrder == null) {
        this.initializeNewOrder(this.selectedPatient?.documentId!)
      }   
      
      this.newOrder!.orderMedicineList.push(medication)
      this.selectedOrder!.orderMedicineList.push(medication)
      this.closeMedicationModal()
      this.switchDetailTab('medications')
    }
  }

  saveOrderProcedure() {

    console.log("Guardando orden procedimiento")

    console.log("procedimiento: ", this.procedureForm)
    if (!this.procedureForm.value.requiresSpecialistAssistance) {
      this.procedureForm.controls.specialistId.setValue(0)
    }

    this.isSubmitted = true

    if (this.procedureForm.valid && this.selectedOrder) {
      const procedure: OrderProcedure = {
        itemNumber: 0,
        procedureName: this.procedureForm.value.procedureName!,
        repetitionNumber: this.procedureForm.value.repetitionNumber!,
        repetitionFrequency: this.procedureForm.value.repetitionFrequency!,
        requiresSpecialistAssistance: this.procedureForm.value.requiresSpecialistAssistance!,
        specialistId: this.procedureForm.value.specialistId!,
        price: this.procedureForm.value.price!,
        creationDate: '',
        bloodPressure: this.procedureForm.value.healthDetail!.bloodPressure!,
        temperature: this.procedureForm.value.healthDetail!.temperature!,
        pulse: this.procedureForm.value.healthDetail!.pulse!,
        bloodOxygenLevel: this.procedureForm.value.healthDetail!.bloodOxygenLevel!,
      }

      console.log("selected order: ", this.selectedOrder)
      console.log("new order: ", this.newOrder)

      if (this.newOrder == null) {
        this.initializeNewOrder(this.selectedPatient?.documentId!)
      }
      
      this.newOrder!.orderProcedureList.push(procedure)
      this.selectedOrder!.orderProcedureList.push(procedure)
      this.closeProcedureModal()
      this.switchDetailTab('procedures')
    }
  }

  saveOrderDiagnosticAssistance() {

    console.log("Guardando orden diagnóstico")

    console.log("form: ", this.diagnosticAssistanceForm)

    if (!this.diagnosticAssistanceForm.value.requiresSpecialistAssistance) {
      this.diagnosticAssistanceForm.controls.specialistId.setValue(0)
    }
    
    this.isSubmitted = true

    if (this.diagnosticAssistanceForm.valid && this.selectedOrder) {
      const diagnostic: OrderDiagnosticAssistance = {
        itemNumber: 0,
        diagnosticAssistanceName: this.diagnosticAssistanceForm.value.diagnosticAssistanceName!,
        quantity: this.diagnosticAssistanceForm.value.quantity!,
        requiresSpecialistAssistance: this.diagnosticAssistanceForm.value.requiresSpecialistAssistance || false,
        specialistId: this.diagnosticAssistanceForm.value.specialistId!,
        price: this.diagnosticAssistanceForm.value.price!,
        creationDate: '',
      }

      console.log("selected order: ", this.selectedOrder)
      console.log("new order: ", this.newOrder)

      if (this.newOrder == null) {
        this.initializeNewOrder(this.selectedPatient?.documentId!)
      }
      
      this.newOrder!.orderDiagnosticAssistanceList.push(diagnostic)
      this.selectedOrder!.orderDiagnosticAssistanceList.push(diagnostic)
      this.closeDiagnosticModal()
      this.switchDetailTab('diagnostics')
    }
  }

  saveOrder() {

    console.log("Guardando orden: ", this.newOrder)

    const hasItems = 
      this.newOrder!.orderMedicineList.length > 0 ||
      this.newOrder!.orderProcedureList.length > 0 ||
      this.newOrder!.orderDiagnosticAssistanceList.length > 0

    if (!hasItems) {
      this.showError('Debe agregar al menos un medicamento, procedimiento o ayuda diagnóstica')
      return
    }

    const orderRequest: Order = {
      orderNumber: this.newOrder!.orderNumber,
      patientId: this.newOrder!.patientId,
      employeeId: this.newOrder!.employeeId,
      orderDiagnosticAssistanceList: this.newOrder!.orderDiagnosticAssistanceList,
      orderMedicineList: this.newOrder!.orderMedicineList,
      orderProcedureList: this.newOrder!.orderProcedureList,
      creationDate: ''
    }

    console.log("ORDER: ", orderRequest)

    this.httpOrderProvider.createOrder(orderRequest).subscribe({
      next: (response) => {
        if (response != null) {
          this.selectedOrder = response
          this.getRecordByPatientId(this.selectedPatient!.documentId)
          this.isLoading = false
        }
      },
      error: (error) => {
        this.showError(error)
        this.isLoading = false
      }
    })
  }

  saveClinicalInfo() {

    this.isLoading = true
    this.isSubmitted = true

    if (this.recordForm.valid) {

      const clinicalRecord: RecordRequest = {
        documentId: this.selectedPatient?.documentId!,
        employeeId: this.recordForm.value.employeeId!,
        reason: this.recordForm.value.reason!,
        symptomatology: this.recordForm.value.symptomatology!,
        diagnosis: this.recordForm.value.diagnosis!,
        date: this.service.dateFormatter(this.recordForm.controls['date'].value!),
        medicationList: [],
        procedureList: [],
        diagnosticAssistanceList: []
      } 

      console.log("Record: ", clinicalRecord)

      this.httpRecordProvider.createRecord(clinicalRecord).subscribe({
        next: (response) => {
          if (response != null) {
            console.log("Historial: ", response)
            this.selectedRecord = response
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

    this.isLoading = false
  }

  getRecordByPatientId(documentId: number) {

    console.log("Buscando historial por id")

    this.isLoading = true
  
    this.httpRecordProvider.getRecordByPatientId(this.selectedPatient?.documentId!).subscribe({
      next: (response) => {
        if (response != null) {
          console.log("Historial: ", response)
          this.selectedRecord = response
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

    this.isLoading = false
  }

  openMedicationModal() {
    this.showMedicationModal = true
    this.medicationForm.reset()
    this.isSubmitted = false
  }

  closeMedicationModal() {
    this.showMedicationModal = false;
    this.medicationForm.reset()
    this.isSubmitted = false
  }

  openProcedureModal() {
    this.showProcedureModal = true
    this.procedureForm.reset()
    this.isSubmitted = false
  }

  closeProcedureModal() {
    this.showProcedureModal = false;
    this.procedureForm.reset()
    this.isSubmitted = false
  }

  openDiagnosticModal() {
    this.showDiagnosticModal = true
    this.diagnosticAssistanceForm.reset()
    this.isSubmitted = false
  }

  closeDiagnosticModal() {
    console.log("cerrando modal: ", this.showDiagnosticModal)
    this.showDiagnosticModal = false;
    this.diagnosticAssistanceForm.reset()
    this.isSubmitted = false
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
