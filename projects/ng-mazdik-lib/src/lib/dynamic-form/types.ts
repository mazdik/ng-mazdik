export type GetOptionsFunc = (url: string, parentId: any) => Promise<any>;

export interface KeyElementChangeEventArgs {
  keyElementName: string;
  keyElementValue: any;
  elementName: string;
  elementValue: string;
}
