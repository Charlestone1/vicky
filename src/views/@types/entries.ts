export type CarDetails = {
    vin: string;
    year: number;
    make: string;
    colour: string;
    price: number;
    category: string;
    staffId?: string | null;
    serviceIds: string[];
    serviceNames: string[];
  }
  
  export type Invoice = {
    name: string;
    carDetails: CarDetails[];
    totalPrice: number;
  }
  
  export type Entry = {
    _id: string;
    customerId: string;
    numberOfVehicles: number;
    vehiclesLeft: number;
    entryDate: string;
    invoice: Invoice;
    customerName: string;
    id: string;
  }
  
  export type ResponseData = {
    message: string;
    success: boolean;
    data: Entry[];
  }
  