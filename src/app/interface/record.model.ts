export interface RecordResponse {
    documentId: number
    clinicalRecords: Record<string, RecordRequest>
}

export interface RecordRequest {
    documentId: number
    date: string
    employeeId: number
    reason: string
    symptomatology: string
    diagnosis: string
    medicationList: Medicine[]
    procedureList: Procedure[]
    diagnosticAssistanceList: DiagnosticAssistance[]
}

export interface Medicine {
    orderNumber: string
    medicineId: string
    dose: string
    treatmentDuration: string
    itemId: number
}

export interface Procedure {
    orderNumber: string
    procedureId: string
    repetitionNumber: number
    repetitionFrequency: string
    requiresSpecialistAssistance: boolean
    specialistId: number
    itemId: number
}

export interface DiagnosticAssistance {
    orderNumber: string
    diagnosticAssistanceId: string
    quantity: number
    itemId: number
    requiresSpecialistAssistance: boolean
    specialistId: number
}