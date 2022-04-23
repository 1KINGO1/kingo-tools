import {Command} from "./Command";
import {LevelSystemUser} from "./LevelSystemUser";
import {LevelSystemRole} from "./LevelSystemRole";
import {EconomyUser} from "./EconomyUser";

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
        logger: {
            on: boolean,
            modChannel: string,
            modAllow: string[], //["BAN", "KICK", "TIMEOUT", "BAN_REMOVE", "TIMEOUT_REMOVE"]
            messageEventsChannel: string,
            messageEventsAllow: string[], // ["MESSAGE_DELETE", "MESSAGE_EDIT", "MESSAGE_PURGED"],
            voiceChannel: string,
            voiceAllow: string[], // ["VOICE_JOIN", "VOICE_LEAVE", "VOICE_CHANGE"],
            membersChannel: string,
            membersAllow: string[], // ["MEMBER_JOIN", "MEMBER_LEAVE", "MEMBER_ROLE_ADD", "MEMBER_ROLE_REMOVE", "MEMBER_NICKNAME_CHANGE"],

        },
        economy: {
            on: boolean,
            economyItems: [],
            users: EconomyUser[]
        },
        commands: Command[]
    },
    data: {
        name: string,
        joinedAt: string,
        avatar: string
    }
}