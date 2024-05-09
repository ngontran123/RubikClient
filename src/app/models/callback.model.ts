export interface ICallbackFunction
{
  (username:string,device_name:string):Promise<void>
};