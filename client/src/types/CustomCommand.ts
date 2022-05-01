export interface CustomCommand{
  name: string,
  text: string,
  sendChannel: string,
  rolesWhiteList: string[],
  channelWhiteList: string[]
}