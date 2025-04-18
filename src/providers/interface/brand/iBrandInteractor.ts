import { Brand } from "../../../entities/brand";

export interface IBrandInteractor {
 createBrand: (
      brand: string,
    description: string,
    brandLogo: string,
    categories: string[],
    createdBy: string) => Promise<{message:string,status:boolean}>;
    getAllBrands: () => Promise<{message:string,status:boolean,brands:Brand[]}>;
}
