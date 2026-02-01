export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class GoogleLoginDto {
    email: string;
    name: string;
    googleId?: string;
    image?: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
}
export declare class ResendOtpDto {
    email: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
