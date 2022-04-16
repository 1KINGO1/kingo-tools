export interface Command{
    on: boolean,
    name: string,
    example: string,
    description: string,
    alternative: string[],
    category: "mod" | "fan" | "config" | "games" | "levels" | "utils",
    rolesWhiteList: string[],
    channelWhiteList: string[]
}
