import { api } from './api';

// Types
export interface Customer {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    address: string;
    city: string;
    country: string;
    nationality: string;
    idType: string;
    idNumber: string;
    dateOfBirth: string;
    createdAt: string;
}

export interface CustomerSearchQuery {
    query?: string;
    email?: string;
    phone?: string;
    idNumber?: string;
}

// Customer Service
export const customerService = {
    /**
     * Get all customers
     */
    getAllCustomers: async (): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/customers');
        return response.data;
    },

    /**
     * Get customer by ID
     */
    getCustomerById: async (id: string): Promise<Customer> => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    /**
     * Create new customer
     */
    createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
        const response = await api.post<Customer>('/customers', customer);
        return response.data;
    },

    /**
     * Update existing customer
     */
    updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
        const response = await api.put<Customer>(`/customers/${id}`, customer);
        return response.data;
    },

    /**
     * Delete customer
     */
    deleteCustomer: async (id: string): Promise<void> => {
        await api.delete(`/customers/${id}`);
    },

    /**
     * Search customers by various criteria
     */
    searchCustomers: async (query: CustomerSearchQuery): Promise<Customer[]> => {
        const response = await api.get<Customer[]>('/customers/search', { params: query });
        return response.data;
    },
};
