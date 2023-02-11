import type {
    GithubProvider,
    ProvidersDict
} from "../provider";
import type {
    UserData,
    UserInfo,
    UsersPulumiInfo
} from "./index";
import type {
    ArgsDict
} from "./types";
import {
    GithubUser
} from "./index";
import {
    slugify
} from "../utils";

/**
 * Compute user configuration
 *
 * @param {GithubProvider} provider - Provider object
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 * @returns {UserData} Object with args and data for Pulumi User Object
 */
function computeUserData (
    provider: GithubProvider,
    userName: string,
    userInfo: UserInfo
): UserData {
    return {
        "args": {
            "gpgKeys": userInfo.gpgKeys ?? {} as ArgsDict,
            "sshKeys": userInfo.sshKeys ?? {} as ArgsDict,
            userName
        },
        "opts": {
            "parent": provider.provider,
            "provider": provider.provider
        }
    };
}

/**
 * Manage user with it possible sub-resource
 *
 * @param {GithubProvider} provider - Provider object
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 */
function manageUser (
    provider: GithubProvider,
    userName: string,
    userInfo: UserInfo
): void {
    const data = computeUserData(
        provider,
        userName,
        userInfo
    );
    const userNameSlug = slugify(`${userName}`);
    provider.users[userName] = new GithubUser(
        userNameSlug,
        data.args,
        data.opts
    );
}

/**
 * Process all user from the configuration
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {string} userName - Name of the user
 * @param {UserInfo} userInfo - Info of the user
 */
function processUsers (
    providers: ProvidersDict,
    userName: string,
    userInfo: UserInfo
): void {
    for (const iProvider in providers) {
        if (iProvider in userInfo.providers) {
            manageUser(
                providers[iProvider],
                userName,
                userInfo
            );
        }
    }
}

/**
 * Initialize the processing of each users defined in the stack
 *
 * @param {ProvidersDict} providers - Set of providers
 * @param {UsersPulumiInfo} [usersInfo] - Users information
 */
export function initUser (
    providers: ProvidersDict,
    usersInfo?: UsersPulumiInfo
): void {
    for (const iUser in usersInfo) {
        processUsers(
            providers,
            iUser,
            usersInfo[iUser]
        );
    }
}
