export declare class User {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    password?: string;
    avatar?: string;
    provider: string;
    otp: string;
    otpExpires: Date;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
