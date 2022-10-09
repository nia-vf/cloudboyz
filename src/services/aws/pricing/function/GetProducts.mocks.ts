import { GetProductsCommandOutput } from "@aws-sdk/client-pricing";
import { productsArrayMock } from "./WriteProductsToFile.mocks";

export const getProductCommandOutputMock: GetProductsCommandOutput = {
    FormatVersion: undefined,
    PriceList: productsArrayMock.map(product => JSON.stringify(product)),
    NextToken: undefined,
    $metadata: {}
}
