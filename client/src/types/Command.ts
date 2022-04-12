export interface Command{
    on: boolean,
    name: string,
    example: string,
    description: string,
    category: "mod" | "fun" | "config" | "games" | "utils",
    rolesWhiteList: string[],
    channelWhiteList: string[]
}
