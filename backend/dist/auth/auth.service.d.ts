import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto, GoogleLoginDto, VerifyOtpDto, ResendOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            avatar?: string;
            provider: string;
            otp: string;
            otpExpires: Date;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            avatar?: string;
            provider: string;
            otp: string;
            otpExpires: Date;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            avatar?: string;
            provider: string;
            otp: string;
            otpExpires: Date;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto): Promise<{
        message: string;
        user: {
            email: string;
        };
        requiresOtp: boolean;
        token?: undefined;
    } | {
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phoneNumber: string;
            avatar?: string;
            provider: string;
            otp: string;
            otpExpires: Date;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
        requiresOtp?: undefined;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private generateToken;
    private generateOtpCode;
    private sendOtpEmail;
}
