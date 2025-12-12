export interface UserData {
    id: number;
    username: string;
    email: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserRegInput {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface LoginInput {
    identifier: string;
    password: string;
}