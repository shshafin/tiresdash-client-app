import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IBrand {
  _id: string;
  name: string;
  description: string;
  logo?: string;
}

// Addon Service interface
export interface IAddonService {
  name?: string;
  price?: number;
  _id?: string;
}

// Updated ITire interface
export interface ITire {
  _id: string;
  name: string;
  year: string | { _id: string; year?: string }; // Can be string or ObjectId reference
  make: string | { _id: string; make?: string };
  model: string | { _id: string; model?: string };
  trim: string | { _id: string; trim?: string };
  tireSize: string | { _id: string; tireSize?: string };
  drivingType?: string | { _id: string; title?: string };
  brand: string | { _id: string; name?: string };
  category: string | { _id: string; name?: string };
  width?: string | { _id: string; width?: string | number } | number;
  ratio?: string | { _id: string; ratio?: string | number } | number;
  diameter?: string | { _id: string; diameter?: string | number } | number;
  vehicleType?: string | { _id: string; vehicleType?: string };
  
  // Service fields
  installationService?: string;
  installationPrice?: number;
  addonServices?: IAddonService[];
  
  description?: string;
  images: string[];
  productLine?: string | string[];
  unitName?: string;
  conditionInfo?: string;
  
  // Range fields
  grossWeightRange?: string;
  gtinRange?: string;
  loadIndexRange?: string;
  mileageWarrantyRange?: string;
  maxAirPressureRange?: string;
  speedRatingRange?: string;
  sidewallDescriptionRange?: string;
  temperatureGradeRange?: string;
  sectionWidthRange?: string;
  wheelRimDiameterRange?: string;
  tractionGradeRange?: string;
  treadDepthRange?: string;
  treadWidthRange?: string;
  overallWidthRange?: string;
  treadwearGradeRange?: string;
  aspectRatioRange?: string;
  
  // Measurement fields
  sectionWidth: number;
  overallDiameter: number;
  rimWidthRange: number;
  treadDepth: number;
  loadIndex: number;
  loadRange?: string;
  maxPSI: number;
  warranty?: string;
  treadPattern?: string;
  loadCapacity: number;
  constructionType?: string;
  tireType?: string;
  
  // Pricing fields
  price: number;
  discountPrice?: number;
  twoSetDiscountPrice?: number;
  fourSetDiscountPrice?: number;
  stockQuantity: number;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Updated IWheel interface
export interface IWheel {
  _id: string;
  name: string;
  year: string | { _id: string; year?: string };
  make: string | { _id: string; make?: string };
  model: string | { _id: string; model?: string };
  trim: string | { _id: string; trim?: string };
  tireSize: string | { _id: string; tireSize?: string };
  drivingType?: string | { _id: string; title?: string };
  brand: string | { _id: string; name?: string };
  category: string | { _id: string; name?: string };
  vehicleType?: string | { _id: string; vehicleType?: string };
  widthType?: string | { _id: string; widthType?: string };
  
  // Service fields
  installationService?: string;
  installationPrice?: number;
  addonServices?: IAddonService[];
  
  description?: string;
  images: string[];
  productLine?: string | string[];
  unitName?: string;
  grossWeight?: string;
  conditionInfo?: string;
  GTIN?: string;
  ATVOffset?: string;
  BoltsQuantity?: string;
  wheelColor?: string;
  hubBore?: string;
  materialType?: string;
  wheelSize?: string;
  wheelAccent?: string;
  wheelPieces?: string;
  
  // Dimension fields
  width?: string | { _id: string; width?: string | number } | number;
  ratio?: string | { _id: string; ratio?: string | number } | number;
  diameter?: string | { _id: string; diameter?: string | number } | number;
  RimDiameter?: number;
  RimWidth?: number;
  rimWidth?: number; // Alternative naming
  boltPattern?: string;
  offset?: number;
  hubBoreSize?: number;
  numberOFBolts?: number;
  loadCapacity?: number;
  loadRating?: number;
  finish?: string;
  warranty?: string;
  constructionType?: string;
  wheelType?: string;
  
  // Pricing fields
  price: number;
  discountPrice?: number;
  twoSetDiscountPrice?: number;
  fourSetDiscountPrice?: number;
  stockQuantity: number;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Optional: Create a union type for products
export type IProduct = ITire | IWheel;

// Helper type guards
export function isTire(product: IProduct): product is ITire {
  return 'tireSize' in product && 'sectionWidth' in product;
}

export function isWheel(product: IProduct): product is IWheel {
  return 'wheelSize' in product || 'wheelType' in product;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IDrivingType {
  _id: string;
  title: string;
  subTitle: string;
  options: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IUser {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label?: React.ReactNode;
  name: string;
  isClearable?: boolean;
  defaultValue?: any;
}

export interface IMake {
  _id: string;
  make: string;
  // year?: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IYear {
  _id: string;
  year: {
    numeric: number;
    display: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IModel {
  _id: string;
  model: string;
  make: IMake | string;
  year: IYear | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITrim {
  _id: string;
  trim: string;
  make: IMake | string;
  model: IModel | string;
  year: IYear | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITyreSize {
  _id: string;
  tireSize: string;
  make: IMake | string;
  model: IModel | string;
  year: IYear | string;
  trim: ITrim | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  trim: string;
  tireSize: string;
}

export interface IFleetNews {
  _id: string;
  badge: string;
  title: string;
  description: string;
  status: string;
  id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IDeal {
  _id: string;
  title: string;
  description: string;
  image?: string;
  discountPercentage: number;
  applicableProducts: string[];
  brand: IBrand;
  validFrom: string;
  validTo: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IBlog {
  _id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// service type

export interface IService {
  _id: string;
  serviceName: string;
  serviceTitle: string;
  servicePrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IServiceFilters {
  searchTerm?: string;
  serviceName?: string;
  serviceTitle?: string;
  minPrice?: number;
  maxPrice?: number;
}