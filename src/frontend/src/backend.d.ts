import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ChatSession {
    id: string;
    title: string;
    created: bigint;
    messages: Array<SessionMessage>;
    lastUpdated: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UserProfile {
    name: string;
}
export interface SessionMessage {
    content: string;
    role: Role;
    timestamp: bigint;
}
export enum Role {
    user = "user",
    assistant = "assistant"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSession(sessionId: string, firstMessage: string): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    getApiKey(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSessionMessages(sessionId: string): Promise<Array<SessionMessage>>;
    getSessions(): Promise<Array<ChatSession>>;
    getStarters(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(sessionId: string, message: string): Promise<string>;
    setApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
