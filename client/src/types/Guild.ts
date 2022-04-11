import {Command} from "./Command";

export interface Guild{
    id: string,
    owner_id: string,
    options: {
        allowed: boolean,
        antiScamLinks: {
            on: boolean,
            cssChecker: boolean,
            websiteIconChecker: boolean,
            inSiteBlackWordsList: string[],
            inSiteTitleBlackWordsList: string[],
            blackListWords: string[],
            punishment: {
                name: "timeout" | "ban" | "none",
                reason: string,
                duration: number
            }
        },
        commands: Command[]
    },
    data: {
        name: string,
        joinedAt: string,
        avatar: string
    }
}