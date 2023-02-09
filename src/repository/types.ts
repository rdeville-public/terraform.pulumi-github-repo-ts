import type * as githubRepository from "./github";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface RepositoryData {
    args: githubRepository.IGithubRepositoryArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface RepositoryInfo {
    providers?: string[];
    description?: string;
    homepageUrl?: string;
    topics?: string[];
    logo?: string;
    labels?: ArgsDict;
    deployKeys?: ArgsDict;
    branches?: ArgsDict;
    protectedBranches?: ArgsDict;
    protectedTags?: ArgsDict;
    secrets?: ArgsDict;
}

export interface ArgsDict {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface RepositoriesPulumiInfo {
    [key: string]: RepositoriesPulumiInfo | RepositoryInfo;
}

export interface RepositoriesDict {
    [key: string]: githubRepository.GithubRepository;
}

export interface RepositoryPulumiConfig {
    [key: string]: pulumi.Inputs | object;
}

// Enum
export enum RepositoryType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
