export interface Product {
  product?: {
    productFamily?: string;
    attributes?: {
      enhancedNetworkingSupported?: string;
      intelTurboAvailable?: string;
      memory?: string;
      dedicatedEbsThroughput?: string;
      vcpu?: string;
      classicnetworkingsupport?: string;
      capacitystatus?: string;
      locationType?: string;
      storage?: string;
      instanceFamily?: string;
      operatingSystem?: string;
      intelAvx2Available?: string;
      regionCode?: string;
      physicalProcessor?: string;
      clockSpeed?: string;
      ecu?: string;
      networkPerformance?: string;
      servicename?: string;
      instancesku?: string;
      vpcnetworkingsupport?: string;
      instanceType?: string;
      tenancy?: string;
      usagetype?: string;
      normalizationSizeFactor?: string;
      intelAvxAvailable?: string;
      processorFeatures?: string;
      servicecode?: string;
      licenseModel?: string;
      currentGeneration?: string;
      preInstalledSw?: string;
      location?: string;
      processorArchitecture?: string;
      marketoption?: string;
      operation?: string;
      availabilityzone?: string;
    };
    sku?: string;
  };
  serviceCode?: string;
  terms?: {
    OnDemand?: OnDemandPairs;
    Reserved?: ReservedPairs;
  };
  version?: string;
  publicationDate?: string;
}

interface OnDemandPairs {
  [key: string]: PriceDimensions;
}

interface PriceDimensionPairs {
  [key: string]: PriceDimension;
}

interface PriceDimension {
  unit?: string;
  endRange?: string;
  description?: string;
  appliesTo?: string;
  rateCode?: string[];
  beginRange?: string;
  pricePerUnit?: { [key: string]: string };
}

interface PriceDimensions {
  priceDimensions?: PriceDimensionPairs;
  sku?: string;
  effectiveDate?: string;
  offerTermCode?: string;
  termAttributes?: {
    LeaseContractLength?: string;
    OfferingClass?: string;
    PurchaseOption?: string;
  };
}

interface ReservedPairs {
  [key: string]: PriceDimensionsR;
}

interface PriceDimensionRPairs {
  [key: string]: PriceDimensionR;
}

interface PriceDimensionR {
  unit?: string;
  endRange?: string;
  description?: string;
  appliesTo?: string[];
  rateCode?: string;
  beginRange?: string;
  pricePerUnit?: { [key: string]: string };
  USD?: string;
}

interface PriceDimensionsR {
  priceDimensions?: PriceDimensionRPairs;
  sku?: string;
  effectiveDate?: string;
  offerTermCode?: string;
  termAttributes?: {
    LeaseContractLength?: string;
    OfferingClass?: string;
    PurchaseOption?: string;
  };
}
