import { getProducts } from "./GetProducts"
import { filtersMapMock, productsArrayMock } from "./WriteProductsToFile.mocks";
import { client } from "../index"
import  * as fs from "fs";
import { getProductCommandOutputMock } from "./GetProducts.mocks";

test('function `getProducts` returns an Array of type `Product`', async () => {
    let spy = jest.spyOn(client, 'send').mockImplementation(() => getProductCommandOutputMock);
    const products = await getProducts(filtersMapMock);
    expect(products.sort).toBe(productsArrayMock.sort)
});
