export interface Guild{
    id: string,
    owner_id: string,
    options: {
        allowed: boolean,
        antiScamLinks: {
            on: boolean,
            cssChecker: boolean,
            websiteIconChecker: boolean,
            inSiteBlackWordsList: Array<string>,
            inSiteTitleBlackWordsList: Array<string>,
            blackListWords: Array<string>,
            punishment: {
                name: "timeout" | "ban" | "none",
                reason: string,
                duration: number
            }
        }
    },
    data: {
        name: string,
        joinedAt: string,
        avatar: string
    }
}