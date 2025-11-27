export interface Order {
    orderNumber: string
    patientId: number
    employeeId: number
    creationDate: string
    orderDiagnosticAssistanceList: OrderDiagnosticAssistance[]
    orderMedicineList: OrderMedicine[]
    orderProcedureList: OrderProcedure[]
}

export interface OrderDiagnosticAssistance {
    itemNumber: number
    diagnosticAssistanceName: string
    quantity: string
    requiresSpecialistAssistance: boolean
    specialistId: number
    price: string
    creationDate: string
}

export interface OrderMedicine {
    itemNumber: number
    medicineName: string
    dose: string
    treatmentDuration: string
    price: string
    creationDate: string
}

export interface OrderProcedure {
    itemNumber: number
    procedureName: string
    repetitionNumber: number
    repetitionFrequency: string
    requiresSpecialistAssistance: boolean
    specialistId: number
    price: string
    creationDate: string
    bloodPressure: string
    temperature: string
    pulse: string
    bloodOxygenLevel: string
}

