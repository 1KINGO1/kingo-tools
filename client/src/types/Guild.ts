import {Command} from "./Command";
import {LevelSystemUser} from "./LevelSystemUser";
import {LevelSystemRole} from "./LevelSystemRole";

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
        levelSystem: {
            on: boolean,
            xpCoefficient: number,
            deleteRolesAfterNewLevel: boolean,
            xpFarmWhiteListChannels: string[],
            whiteListRoles: string[],
            levelRoles: LevelSystemRole[],
            users: LevelSystemUser[]
        },
        commands: Command[]
    },
    data: {
        name: string,
        joinedAt: string,
        avatar: string
    }
}