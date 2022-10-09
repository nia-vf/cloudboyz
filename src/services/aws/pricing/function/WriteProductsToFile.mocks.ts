import { Product } from "../../../../interfaces/product";

export const filtersMapMock = new Map<string, string>([
  ["instanceType", "t3.micro"],
  ["operatingSystem", "Linux"],
]);

export const productsArrayMock: Product[] = [
  {
    product: {
      productFamily: "Compute Instance",
      attributes: {
        enhancedNetworkingSupported: "No",
        intelTurboAvailable: "Yes",
        memory: "1 GiB",
        dedicatedEbsThroughput: "Up to 2085 Mbps",
        vcpu: "2",
        classicnetworkingsupport: "false",
        capacitystatus: "UnusedCapacityReservation",
        locationType: "AWS Region",
        storage: "EBS only",
        instanceFamily: "General purpose",
        operatingSystem: "Linux",
        intelAvx2Available: "Yes",
        regionCode: "eu-central-1",
        physicalProcessor: "Intel Skylake E5 2686 v5",
        clockSpeed: "3.1 GHz",
        ecu: "Variable",
        networkPerformance: "Up to 5 Gigabit",
        servicename: "Amazon Elastic Compute Cloud",
        instancesku: "Q7XFK558YJTFPWDH",
        vpcnetworkingsupport: "true",
        instanceType: "t3.micro",
        tenancy: "Dedicated",
        usagetype: "EUC1-UnusedDed:t3.micro",
        normalizationSizeFactor: "0.5",
        intelAvxAvailable: "Yes",
        processorFeatures:
          "AVX; AVX2; Intel AVX; Intel AVX2; Intel AVX512; Intel Turbo",
        servicecode: "AmazonEC2",
        licenseModel: "No License required",
        currentGeneration: "Yes",
        preInstalledSw: "SQL Web",
        location: "EU (Frankfurt)",
        processorArchitecture: "64-bit",
        marketoption: "OnDemand",
        operation: "RunInstances:0200",
        availabilityzone: "NA",
      },
      sku: "Y6JK4U8NZRJW6Z2M",
    },
    serviceCode: "AmazonEC2",
    terms: {
      OnDemand: {
        "Y6JK4U8NZRJW6Z2M.JRTCKXETXF": {
          priceDimensions: {
            "Y6JK4U8NZRJW6Z2M.JRTCKXETXF.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "$0.0804 per Dedicated Unused Reservation Linux with SQL Web t3.micro Instance Hour",
              appliesTo: [],
              rateCode: "Y6JK4U8NZRJW6Z2M.JRTCKXETXF.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0804000000",
              },
            },
          },
          sku: "Y6JK4U8NZRJW6Z2M",
          effectiveDate: "2022-10-01T00:00:00Z",
          offerTermCode: "JRTCKXETXF",
          termAttributes: {},
        },
      },
    },
    version: "20221005211642",
    publicationDate: "2022-10-05T21:16:42Z",
  },
  {
    product: {
      productFamily: "Compute Instance",
      attributes: {
        enhancedNetworkingSupported: "No",
        intelTurboAvailable: "Yes",
        memory: "1 GiB",
        dedicatedEbsThroughput: "Up to 2085 Mbps",
        vcpu: "2",
        classicnetworkingsupport: "false",
        capacitystatus: "Used",
        locationType: "AWS Region",
        storage: "EBS only",
        instanceFamily: "General purpose",
        operatingSystem: "Linux",
        intelAvx2Available: "Yes",
        regionCode: "af-south-1",
        physicalProcessor: "Intel Skylake E5 2686 v5",
        clockSpeed: "3.1 GHz",
        ecu: "Variable",
        networkPerformance: "Up to 5 Gigabit",
        servicename: "Amazon Elastic Compute Cloud",
        vpcnetworkingsupport: "true",
        instanceType: "t3.micro",
        tenancy: "Dedicated",
        usagetype: "AFS1-DedicatedUsage:t3.micro",
        normalizationSizeFactor: "0.5",
        intelAvxAvailable: "Yes",
        processorFeatures:
          "AVX; AVX2; Intel AVX; Intel AVX2; Intel AVX512; Intel Turbo",
        servicecode: "AmazonEC2",
        licenseModel: "No License required",
        currentGeneration: "Yes",
        preInstalledSw: "NA",
        location: "Africa (Cape Town)",
        processorArchitecture: "64-bit",
        marketoption: "OnDemand",
        operation: "RunInstances",
        availabilityzone: "NA",
      },
      sku: "XUDFFMF54T6N8VEC",
    },
    serviceCode: "AmazonEC2",
    terms: {
      OnDemand: {
        "XUDFFMF54T6N8VEC.JRTCKXETXF": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.JRTCKXETXF.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description: "$0.0144 per Dedicated Linux t3.micro Instance Hour",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.JRTCKXETXF.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0144000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2022-10-01T00:00:00Z",
          offerTermCode: "JRTCKXETXF",
          termAttributes: {},
        },
      },
      Reserved: {
        "XUDFFMF54T6N8VEC.7NE97W5U4E": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.7NE97W5U4E.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.7NE97W5U4E.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0119000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "7NE97W5U4E",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "convertible",
            PurchaseOption: "No Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.CUZHX8X6JH": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.CUZHX8X6JH.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.CUZHX8X6JH.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0057000000",
              },
            },
            "XUDFFMF54T6N8VEC.CUZHX8X6JH.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.CUZHX8X6JH.2TG2D8R56U",
              pricePerUnit: {
                USD: "50",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "CUZHX8X6JH",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "convertible",
            PurchaseOption: "Partial Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.MZU6U2429S": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.MZU6U2429S.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.MZU6U2429S.2TG2D8R56U",
              pricePerUnit: {
                USD: "209",
              },
            },
            "XUDFFMF54T6N8VEC.MZU6U2429S.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "USD 0.0 per Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.MZU6U2429S.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0000000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "MZU6U2429S",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "convertible",
            PurchaseOption: "All Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.HU7G6KETJZ": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.HU7G6KETJZ.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.HU7G6KETJZ.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0045000000",
              },
            },
            "XUDFFMF54T6N8VEC.HU7G6KETJZ.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.HU7G6KETJZ.2TG2D8R56U",
              pricePerUnit: {
                USD: "39",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "HU7G6KETJZ",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "standard",
            PurchaseOption: "Partial Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.4NA7Y494T4": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.4NA7Y494T4.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.4NA7Y494T4.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0094000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "4NA7Y494T4",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "standard",
            PurchaseOption: "No Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.VJWZNREJX2": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.VJWZNREJX2.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.VJWZNREJX2.2TG2D8R56U",
              pricePerUnit: {
                USD: "98",
              },
            },
            "XUDFFMF54T6N8VEC.VJWZNREJX2.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "USD 0.0 per Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.VJWZNREJX2.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0000000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "VJWZNREJX2",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "convertible",
            PurchaseOption: "All Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.NQ3QZPMQV9": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.NQ3QZPMQV9.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.NQ3QZPMQV9.2TG2D8R56U",
              pricePerUnit: {
                USD: "155",
              },
            },
            "XUDFFMF54T6N8VEC.NQ3QZPMQV9.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "USD 0.0 per Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.NQ3QZPMQV9.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0000000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "NQ3QZPMQV9",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "standard",
            PurchaseOption: "All Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.BPH4J8HBKS": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.BPH4J8HBKS.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.BPH4J8HBKS.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0067000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "BPH4J8HBKS",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "standard",
            PurchaseOption: "No Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.Z2E3P23VKM": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.Z2E3P23VKM.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.Z2E3P23VKM.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0087000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "Z2E3P23VKM",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "convertible",
            PurchaseOption: "No Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.6QCMYABX3D": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.6QCMYABX3D.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "USD 0.0 per Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.6QCMYABX3D.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0000000000",
              },
            },
            "XUDFFMF54T6N8VEC.6QCMYABX3D.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.6QCMYABX3D.2TG2D8R56U",
              pricePerUnit: {
                USD: "77",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "6QCMYABX3D",
          termAttributes: {
            LeaseContractLength: "1yr",
            OfferingClass: "standard",
            PurchaseOption: "All Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.R5XV2EPZQZ": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.R5XV2EPZQZ.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.R5XV2EPZQZ.2TG2D8R56U",
              pricePerUnit: {
                USD: "106",
              },
            },
            "XUDFFMF54T6N8VEC.R5XV2EPZQZ.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.R5XV2EPZQZ.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0040000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "R5XV2EPZQZ",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "convertible",
            PurchaseOption: "Partial Upfront",
          },
        },
        "XUDFFMF54T6N8VEC.38NPMPTW36": {
          priceDimensions: {
            "XUDFFMF54T6N8VEC.38NPMPTW36.2TG2D8R56U": {
              unit: "Quantity",
              description: "Upfront Fee",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.38NPMPTW36.2TG2D8R56U",
              pricePerUnit: {
                USD: "82",
              },
            },
            "XUDFFMF54T6N8VEC.38NPMPTW36.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "Linux/UNIX (Amazon VPC), t3.micro reserved instance applied",
              appliesTo: [],
              rateCode: "XUDFFMF54T6N8VEC.38NPMPTW36.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0031000000",
              },
            },
          },
          sku: "XUDFFMF54T6N8VEC",
          effectiveDate: "2020-04-01T00:00:00Z",
          offerTermCode: "38NPMPTW36",
          termAttributes: {
            LeaseContractLength: "3yr",
            OfferingClass: "standard",
            PurchaseOption: "Partial Upfront",
          },
        },
      },
    },
    version: "20221005211642",
    publicationDate: "2022-10-05T21:16:42Z",
  },
  {
    product: {
      productFamily: "Compute Instance",
      attributes: {
        enhancedNetworkingSupported: "No",
        intelTurboAvailable: "Yes",
        memory: "1 GiB",
        dedicatedEbsThroughput: "Up to 2085 Mbps",
        vcpu: "2",
        classicnetworkingsupport: "false",
        capacitystatus: "AllocatedCapacityReservation",
        locationType: "AWS Region",
        storage: "EBS only",
        instanceFamily: "General purpose",
        operatingSystem: "Linux",
        intelAvx2Available: "Yes",
        regionCode: "af-south-1",
        physicalProcessor: "Intel Skylake E5 2686 v5",
        clockSpeed: "3.1 GHz",
        ecu: "Variable",
        networkPerformance: "Up to 5 Gigabit",
        servicename: "Amazon Elastic Compute Cloud",
        instancesku: "R4RUBNMUR6UTJXZQ",
        vpcnetworkingsupport: "true",
        instanceType: "t3.micro",
        tenancy: "Shared",
        usagetype: "AFS1-Reservation:t3.micro",
        normalizationSizeFactor: "0.5",
        intelAvxAvailable: "Yes",
        processorFeatures:
          "AVX; AVX2; Intel AVX; Intel AVX2; Intel AVX512; Intel Turbo",
        servicecode: "AmazonEC2",
        licenseModel: "No License required",
        currentGeneration: "Yes",
        preInstalledSw: "SQL Web",
        location: "Africa (Cape Town)",
        processorArchitecture: "64-bit",
        marketoption: "OnDemand",
        operation: "RunInstances:0200",
        availabilityzone: "NA",
      },
      sku: "XHPE94YUY5Q6CS73",
    },
    serviceCode: "AmazonEC2",
    terms: {
      OnDemand: {
        "XHPE94YUY5Q6CS73.JRTCKXETXF": {
          priceDimensions: {
            "XHPE94YUY5Q6CS73.JRTCKXETXF.6YS6EN2CT7": {
              unit: "Hrs",
              endRange: "Inf",
              description:
                "$0.00 per Reservation Linux with SQL Web t3.micro Instance Hour",
              appliesTo: [],
              rateCode: "XHPE94YUY5Q6CS73.JRTCKXETXF.6YS6EN2CT7",
              beginRange: "0",
              pricePerUnit: {
                USD: "0.0000000000",
              },
            },
          },
          sku: "XHPE94YUY5Q6CS73",
          effectiveDate: "2022-10-01T00:00:00Z",
          offerTermCode: "JRTCKXETXF",
          termAttributes: {},
        },
      },
    },
    version: "20221005211642",
    publicationDate: "2022-10-05T21:16:42Z",
  },
];
