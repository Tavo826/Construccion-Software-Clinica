export interface LoginRequest {
    username: string,
    password: string
}

export interface LoginResponse {
    token: string
}

export interface Employee {
    documentId: number
    name: string
    surname: string
    birthDate: string
    phone: number
    email: string
    address: string
    role: string
    username: string
    password: string
}

export interface Patient {
    documentId: number
    name: string
    surname: string
    birthDate: string
    phone: number
    email: string
    address: string
    age: number
    gender: string
    emergencyContact: EmergencyContact
    healthInsurance: HealthInsurance
}

export interface EmergencyContact {
    name: string
    surname: string
    relationship: string
    phone: number
}

export interface HealthInsurance {
    companyName: string
    policyNumber: number
    active: boolean
    policyValidityDays: number
    policyValidity: string
}

