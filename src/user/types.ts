import type * as githubUser from "./github";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface UserData {
    args: githubUser.IGithubUserArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface ArgsDict {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface UserInfo {
    providers: ArgsDict;
    sshKeys?: ArgsDict;
    gpgKeys?: ArgsDict;
}

export interface UsersPulumiConfig {
    [key: string]: UserInfo;
}

export interface UsersPulumiInfo {
    [key: string]: UserInfo;
}

export interface UsersDict {
    [key: string]: githubUser.GithubUser;
}
