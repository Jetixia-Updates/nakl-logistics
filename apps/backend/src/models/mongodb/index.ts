import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// TENDERS (المناقصات)
// ============================================

export interface ITender extends Document {
  tenderNumber: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  
  // Tender Information
  customerId: string;
  customerName: string;
  
  // Dates
  publishDate: Date;
  submissionDeadline: Date;
  openingDate: Date;
  expectedStartDate?: Date;
  expectedEndDate?: Date;
  
  // Financial
  estimatedValue: number;
  currency: string;
  
  // Requirements
  requirements: {
    description: string;
    descriptionAr: string;
  }[];
  
  // Locations
  pickupLocations: {
    address: string;
    city: string;
    governorate: string;
    coordinates?: { lat: number; lng: number };
  }[];
  
  deliveryLocations: {
    address: string;
    city: string;
    governorate: string;
    coordinates?: { lat: number; lng: number };
  }[];
  
  // Cargo Details
  cargoType: string;
  cargoWeight: number; // in tons
  cargoVolume?: number;
  specialRequirements?: string;
  
  // Status
  status: 'PUBLISHED' | 'SUBMITTED' | 'UNDER_EVALUATION' | 'AWARDED' | 'REJECTED' | 'CANCELLED';
  
  // Our Submission
  ourBid?: {
    submittedAt: Date;
    proposedPrice: number;
    technicalProposal: string;
    documents: {
      name: string;
      url: string;
      type: string;
    }[];
    notes?: string;
  };
  
  // Award Information
  awardedTo?: string;
  awardDate?: Date;
  awardAmount?: number;
  contractNumber?: string;
  
  // Documents
  documents: {
    name: string;
    nameAr: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];
  
  notes?: string;
  
  createdBy: string;
  updatedBy?: string;
}

const TenderSchema = new Schema<ITender>(
  {
    tenderNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    publishDate: { type: Date, required: true },
    submissionDeadline: { type: Date, required: true },
    openingDate: { type: Date, required: true },
    expectedStartDate: Date,
    expectedEndDate: Date,
    estimatedValue: { type: Number, required: true },
    currency: { type: String, default: 'EGP' },
    requirements: [
      {
        description: String,
        descriptionAr: String,
      },
    ],
    pickupLocations: [
      {
        address: String,
        city: String,
        governorate: String,
        coordinates: { lat: Number, lng: Number },
      },
    ],
    deliveryLocations: [
      {
        address: String,
        city: String,
        governorate: String,
        coordinates: { lat: Number, lng: Number },
      },
    ],
    cargoType: { type: String, required: true },
    cargoWeight: { type: Number, required: true },
    cargoVolume: Number,
    specialRequirements: String,
    status: {
      type: String,
      enum: ['PUBLISHED', 'SUBMITTED', 'UNDER_EVALUATION', 'AWARDED', 'REJECTED', 'CANCELLED'],
      default: 'PUBLISHED',
    },
    ourBid: {
      submittedAt: Date,
      proposedPrice: Number,
      technicalProposal: String,
      documents: [
        {
          name: String,
          url: String,
          type: String,
        },
      ],
      notes: String,
    },
    awardedTo: String,
    awardDate: Date,
    awardAmount: Number,
    contractNumber: String,
    documents: [
      {
        name: String,
        nameAr: String,
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],
    notes: String,
    createdBy: { type: String, required: true },
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

TenderSchema.index({ tenderNumber: 1 });
TenderSchema.index({ status: 1 });
TenderSchema.index({ customerId: 1 });
TenderSchema.index({ submissionDeadline: 1 });

export const Tender = mongoose.model<ITender>('Tender', TenderSchema);

// ============================================
// WORK ORDERS (أوامر التشغيل)
// ============================================

export interface IWorkOrder extends Document {
  workOrderNumber: string;
  title: string;
  titleAr: string;
  
  // Source
  sourceType: 'TENDER' | 'DIRECT_CONTRACT' | 'SPOT';
  sourceId?: string; // Tender ID or Contract ID
  
  // Customer
  customerId: string;
  customerName: string;
  contractNumber?: string;
  
  // Financial
  agreedPrice: number;
  currency: string;
  paymentTerms?: string;
  
  // Dates
  orderDate: Date;
  expectedStartDate: Date;
  expectedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  
  // Cargo Details
  cargoType: string;
  cargoDescription: string;
  cargoDescriptionAr: string;
  cargoWeight: number;
  cargoVolume?: number;
  cargoValue?: number;
  packagingType?: string;
  quantity: number;
  unit: string;
  
  // Locations
  pickupLocation: {
    contactPerson: string;
    contactPhone: string;
    address: string;
    city: string;
    governorate: string;
    coordinates?: { lat: number; lng: number };
    instructions?: string;
  };
  
  deliveryLocation: {
    contactPerson: string;
    contactPhone: string;
    address: string;
    city: string;
    governorate: string;
    coordinates?: { lat: number; lng: number };
    instructions?: string;
  };
  
  // Vehicle Assignment
  assignedVehicle?: {
    vehicleId: string;
    plateNumber: string;
    vendorId: string;
    vendorName: string;
    driverName: string;
    driverPhone: string;
    driverLicense: string;
    assignedAt: Date;
  };
  
  // Route & Tracking
  plannedRoute?: {
    distance: number; // in km
    estimatedDuration: number; // in minutes
    waypoints: { lat: number; lng: number }[];
  };
  
  actualRoute?: {
    distance: number;
    duration: number;
    trackingPoints: {
      lat: number;
      lng: number;
      timestamp: Date;
      speed?: number;
    }[];
  };
  
  // Status
  status:
    | 'PENDING'
    | 'ASSIGNED'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'ON_HOLD';
  
  // Milestones
  milestones: {
    type: 'PICKUP' | 'CHECKPOINT' | 'DELIVERY' | 'OTHER';
    description: string;
    plannedTime?: Date;
    actualTime?: Date;
    location?: { lat: number; lng: number };
    completedBy?: string;
    notes?: string;
  }[];
  
  // Documents
  documents: {
    type: string;
    name: string;
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];
  
  // Costs
  costs: {
    type: string; // FUEL, TOLL, MAINTENANCE, VENDOR_PAYMENT, OTHER
    description: string;
    amount: number;
    date: Date;
    vendorId?: string;
    notes?: string;
  }[];
  
  // Issues & Incidents
  incidents: {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    reportedAt: Date;
    reportedBy: string;
    resolvedAt?: Date;
    resolution?: string;
  }[];
  
  notes?: string;
  specialInstructions?: string;
  
  createdBy: string;
  updatedBy?: string;
}

const WorkOrderSchema = new Schema<IWorkOrder>(
  {
    workOrderNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    sourceType: { type: String, enum: ['TENDER', 'DIRECT_CONTRACT', 'SPOT'], required: true },
    sourceId: String,
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    contractNumber: String,
    agreedPrice: { type: Number, required: true },
    currency: { type: String, default: 'EGP' },
    paymentTerms: String,
    orderDate: { type: Date, required: true },
    expectedStartDate: { type: Date, required: true },
    expectedEndDate: { type: Date, required: true },
    actualStartDate: Date,
    actualEndDate: Date,
    cargoType: { type: String, required: true },
    cargoDescription: { type: String, required: true },
    cargoDescriptionAr: { type: String, required: true },
    cargoWeight: { type: Number, required: true },
    cargoVolume: Number,
    cargoValue: Number,
    packagingType: String,
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    pickupLocation: {
      contactPerson: String,
      contactPhone: String,
      address: String,
      city: String,
      governorate: String,
      coordinates: { lat: Number, lng: Number },
      instructions: String,
    },
    deliveryLocation: {
      contactPerson: String,
      contactPhone: String,
      address: String,
      city: String,
      governorate: String,
      coordinates: { lat: Number, lng: Number },
      instructions: String,
    },
    assignedVehicle: {
      vehicleId: String,
      plateNumber: String,
      vendorId: String,
      vendorName: String,
      driverName: String,
      driverPhone: String,
      driverLicense: String,
      assignedAt: Date,
    },
    plannedRoute: {
      distance: Number,
      estimatedDuration: Number,
      waypoints: [{ lat: Number, lng: Number }],
    },
    actualRoute: {
      distance: Number,
      duration: Number,
      trackingPoints: [
        {
          lat: Number,
          lng: Number,
          timestamp: Date,
          speed: Number,
        },
      ],
    },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'ON_HOLD'],
      default: 'PENDING',
    },
    milestones: [
      {
        type: { type: String, enum: ['PICKUP', 'CHECKPOINT', 'DELIVERY', 'OTHER'] },
        description: String,
        plannedTime: Date,
        actualTime: Date,
        location: { lat: Number, lng: Number },
        completedBy: String,
        notes: String,
      },
    ],
    documents: [
      {
        type: String,
        name: String,
        url: String,
        uploadedBy: String,
        uploadedAt: Date,
      },
    ],
    costs: [
      {
        type: String,
        description: String,
        amount: Number,
        date: Date,
        vendorId: String,
        notes: String,
      },
    ],
    incidents: [
      {
        type: String,
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
        description: String,
        reportedAt: Date,
        reportedBy: String,
        resolvedAt: Date,
        resolution: String,
      },
    ],
    notes: String,
    specialInstructions: String,
    createdBy: { type: String, required: true },
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

WorkOrderSchema.index({ workOrderNumber: 1 });
WorkOrderSchema.index({ status: 1 });
WorkOrderSchema.index({ customerId: 1 });
WorkOrderSchema.index({ 'assignedVehicle.vehicleId': 1 });
WorkOrderSchema.index({ expectedStartDate: 1 });

export const WorkOrder = mongoose.model<IWorkOrder>('WorkOrder', WorkOrderSchema);

// ============================================
// GPS TRACKING DATA
// ============================================

export interface IGPSTracking extends Document {
  deviceId: string;
  vehicleId: string;
  workOrderId?: string;
  
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  
  speed: number; // km/h
  heading: number; // degrees
  altitude?: number;
  accuracy?: number;
  
  engineStatus: 'ON' | 'OFF';
  fuelLevel?: number;
  temperature?: number;
  
  timestamp: Date;
  receivedAt: Date;
}

const GPSTrackingSchema = new Schema<IGPSTracking>(
  {
    deviceId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    workOrderId: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    speed: { type: Number, default: 0 },
    heading: { type: Number, default: 0 },
    altitude: Number,
    accuracy: Number,
    engineStatus: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
    fuelLevel: Number,
    temperature: Number,
    timestamp: { type: Date, required: true },
    receivedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

GPSTrackingSchema.index({ deviceId: 1, timestamp: -1 });
GPSTrackingSchema.index({ vehicleId: 1, timestamp: -1 });
GPSTrackingSchema.index({ workOrderId: 1, timestamp: -1 });
GPSTrackingSchema.index({ location: '2dsphere' });

export const GPSTracking = mongoose.model<IGPSTracking>('GPSTracking', GPSTrackingSchema);

// ============================================
// WAREHOUSE OPERATIONS
// ============================================

export interface IWarehouseOperation extends Document {
  operationNumber: string;
  type: 'GOODS_RECEIPT' | 'GOODS_ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'COUNT';
  
  workOrderId?: string;
  referenceNumber?: string;
  
  warehouseId: string;
  warehouseName: string;
  
  items: {
    itemCode: string;
    itemName: string;
    itemNameAr: string;
    quantity: number;
    unit: string;
    location?: string; // Bin location
    batch?: string;
    serialNumber?: string;
  }[];
  
  sourceLocation?: {
    warehouseId: string;
    location: string;
  };
  
  destinationLocation?: {
    warehouseId: string;
    location: string;
  };
  
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  
  performedBy: string;
  verifiedBy?: string;
  
  date: Date;
  completedAt?: Date;
  
  notes?: string;
}

const WarehouseOperationSchema = new Schema<IWarehouseOperation>(
  {
    operationNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['GOODS_RECEIPT', 'GOODS_ISSUE', 'TRANSFER', 'ADJUSTMENT', 'COUNT'],
      required: true,
    },
    workOrderId: String,
    referenceNumber: String,
    warehouseId: { type: String, required: true },
    warehouseName: { type: String, required: true },
    items: [
      {
        itemCode: String,
        itemName: String,
        itemNameAr: String,
        quantity: Number,
        unit: String,
        location: String,
        batch: String,
        serialNumber: String,
      },
    ],
    sourceLocation: {
      warehouseId: String,
      location: String,
    },
    destinationLocation: {
      warehouseId: String,
      location: String,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
    },
    performedBy: { type: String, required: true },
    verifiedBy: String,
    date: { type: Date, required: true },
    completedAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

WarehouseOperationSchema.index({ operationNumber: 1 });
WarehouseOperationSchema.index({ type: 1 });
WarehouseOperationSchema.index({ workOrderId: 1 });

export const WarehouseOperation = mongoose.model<IWarehouseOperation>(
  'WarehouseOperation',
  WarehouseOperationSchema
);
