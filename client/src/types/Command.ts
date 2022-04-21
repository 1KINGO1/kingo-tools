export interface Command{
    on: boolean,
    name: string,
    example: string,
    description: string,
    alternative: string[],
    isSlash: boolean,
    category: "mod" | "fan" | "config" | "games" | "levels"  | "economy" | "utils",
    rolesWhiteList: string[],
    channelWhiteList: string[]
}
