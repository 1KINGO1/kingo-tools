export interface Command{
    on: boolean,
    name: string,
    example: string,
    description: string,
    category: "mod" | "fun" | "config" | "games",
    rolesWhiteList: string[],
    channelWhiteList: string[]
}
