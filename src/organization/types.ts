import type * as githubOrganization from "./github";
import type * as pulumi from "@pulumi/pulumi";

// Interface
export interface OrganizationData {
    args: githubOrganization.IGithubOrganizationArgs;
    opts: pulumi.CustomResourceOptions;
}

export interface OrganizationInfo {
    config?: string;
    providers?: string[];
    settings: ArgsDict;
}

export interface ArgsDict {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface OrganizationsPulumiInfo {
    [key: string]: OrganizationInfo;
}

export interface OrganizationsDict {
    [key: string]: githubOrganization.GithubOrganization;
}

export interface OrganizationPulumiConfig {
    [key: string]: pulumi.Inputs | object;
}

// Enum
export enum OrganizationType {
    default = "default",
    fork = "fork",
    mirror = "mirror"
}
