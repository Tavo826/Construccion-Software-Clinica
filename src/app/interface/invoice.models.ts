import { Order } from "./order.models"
import { Employee, Patient } from "./user.models"

export interface Invoice {
    id: number
    patientId: number
    employeeId: number
    orderId: string
    payment: Payment
    paid: boolean
    details: InvoiceDetails
    creationDate: string
}

export interface InvoiceDetails {
    patient: Patient
    employee: Employee
    order: Order
}

export interface Payment {
    coPayment: number
    insurePayment: number
    totalPayment: number
}