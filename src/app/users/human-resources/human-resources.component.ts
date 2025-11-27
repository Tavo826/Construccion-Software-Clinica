import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../interface/user.models';
import { HttpEmployeeProviderService } from '../../service/http-employee-provider.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from '../../shared/error/error.component';

@Component({
  selector: 'app-human-resources',
  imports: [ReactiveFormsModule, LoadingComponent, FormsModule, CommonModule, ErrorComponent],
  templateUrl: './human-resources.component.html',
  styleUrl: './human-resources.component.css'
})
export class HumanResourcesComponent implements OnInit {

  private readonly formBuilder = inject(FormBuilder)
  httpProvider = inject(HttpEmployeeProviderService)
  
  constructor(private service: AuthService) {}

  isLoading: boolean = true
  showModal: boolean = false
  isEditMode: boolean = false
  isSubmitted: boolean = false;
  showPassword: boolean = false;
  showErrorModal: boolean = false;
  showDeleteModal: boolean = false

  searchTerm: string = ''
  errorMessage: string = '';
  errorTitle: string = "Error administrando empleado"

  employeeList: Employee[] = []
  selectedEmployee: Employee | null = null


  form = this.formBuilder.group({
    documentId: [0, [Validators.required, Validators.minLength(8)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    birthDate: ['', [Validators.required]],
    phone: [0, [Validators.required, Validators.minLength(7)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    role: ['', [Validators.required]], 
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  ngOnInit(): void {
    this.loadEmployees()
  }

  loadEmployees() {

    this.isLoading = true
    this.searchTerm = ''

    this.httpProvider.getAllEmployees().subscribe({
      next: (response) => {
        if (response != null) {
          this.employeeList = response
          this.isLoading = false
        } else {
          this.employeeList = []
          this.isLoading = false
        }
      },
      error: (error) => {
        this.showError(error)
        this.isLoading = false
      }
    })
  }

  findEmployeeById() {

    if (this.searchTerm.length > 7) {

      this.httpProvider.getEmployeeById(this.searchTerm).subscribe({
        next: (response) => {
          if (response != null) {
            const filteredEmployee: Employee[] = [response]
            this.employeeList = filteredEmployee
            this.isLoading = false
          } else {
            this.employeeList = []
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

  saveEmployee() {

    this.isSubmitted = true
    if (this.form.invalid) return

    const employeeData: Employee = {
      documentId: this.form.controls['documentId'].value!,
      name: this.form.controls['name'].value!,
      surname: this.form.controls['surname'].value!,
      birthDate: this.service.dateFormatter(this.form.controls['birthDate'].value!),
      phone: this.form.controls['phone'].value!,
      email: this.form.controls['email'].value!,
      address: this.form.controls['address'].value!,
      role: this.form.controls['role'].value!,
      username: this.form.controls['username'].value!,
      password: this.form.controls['password'].value!,
    }

    if (this.isEditMode) {

      this.httpProvider.updateEmployee(employeeData).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeModal()
          this.isSubmitted = false
          this.isLoading = false
        },
        error: (error) => {
          this.closeModal()
          this.showError(error)
          this.isSubmitted = false
          this.isLoading = false
        }
      })

    } else {

      this.httpProvider.createEmployee(employeeData).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeModal()
          this.isSubmitted = false
          this.isLoading = false
        },
        error: (error) => {
          this.closeModal()
          this.showError(error)
          this.isSubmitted = false
          this.isLoading = false
        }
      })
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  openCreateModal() {
    this.isEditMode = false
    this.selectedEmployee = null
    this.showModal = true
    this.form.reset()
  }

  openEditModal(employee: Employee) {
    this.isEditMode = true
    this.selectedEmployee = {...employee}
    this.showModal = true
    this.form.patchValue(employee)
  }

  closeModal() {
    this.showModal = false
    this.isEditMode = false
    this.form.reset()
  }

  openDeleteModal(employee: Employee) {
    this.selectedEmployee = employee
    this.showDeleteModal = true
  }

  closeDeleteModal() {
    this.showDeleteModal = false
    this.selectedEmployee = null
  }

  logout() {
    this.service.logout()
  }

  confirmDelete() {
    if (this.selectedEmployee) {

      this.httpProvider.deleteEmployee(this.selectedEmployee.documentId).subscribe({
        next: () => {
          this.loadEmployees()
          this.closeModal()
          this.isLoading = false
        },
        error: (error) => {
          this.closeModal()
          this.showError(error)
          this.isLoading = false
        }
      })

    }

    this.closeDeleteModal()
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

}
