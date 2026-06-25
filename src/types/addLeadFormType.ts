export enum AddNewLeadFormKeys {
    fullName = 'fullName',
    houseAddress = 'houseAddress',
    phoneNumber = 'phoneNumber',
}

export interface AddnewLeadFormType {
    [AddNewLeadFormKeys.fullName]: string;
    [AddNewLeadFormKeys.houseAddress]: string;
    [AddNewLeadFormKeys.phoneNumber]: string;
}

export interface ErrorAddLeadMessagesType {
    [AddNewLeadFormKeys.fullName]?: string;
    [AddNewLeadFormKeys.houseAddress]?: string;
    [AddNewLeadFormKeys.phoneNumber]?: string;
}