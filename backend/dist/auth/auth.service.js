"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, name, phoneNumber } = registerDto;
        const existingUser = await this.userService.findOneByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = this.generateOtpCode();
        const otpExpires = new Date(Date.now() + 7 * 60 * 1000);
        const newUser = await this.userService.create({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            provider: 'credentials',
            otp,
            otpExpires,
            isVerified: false,
        });
        await this.sendOtpEmail(email, otp, 'register');
        console.log(`[OTP] Sent to ${email}: ${otp}`);
        const { password: _, ...userWithoutPassword } = newUser;
        return {
            message: 'User registered successfully. Please verify OTP.',
            user: userWithoutPassword,
        };
    }
    async verifyOtp(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.otp !== otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (user.otpExpires < new Date()) {
            throw new common_1.BadRequestException('OTP expired');
        }
        await this.userService.update(user.id, {
            isVerified: true,
            otp: null,
            otpExpires: null,
        });
        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'Verification successful',
            user: userWithoutPassword,
            token,
        };
    }
    async resendOtp(resendOtpDto) {
        const { email } = resendOtpDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = this.generateOtpCode();
        const otpExpires = new Date(Date.now() + 7 * 60 * 1000);
        await this.userService.update(user.id, {
            otp,
            otpExpires,
        });
        await this.sendOtpEmail(email, otp, 'register');
        console.log(`[OTP] Resent to ${email}: ${otp}`);
        return {
            message: 'OTP resent successfully',
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.provider === 'credentials' && !user.isVerified) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        };
    }
    async googleLogin(googleLoginDto) {
        const { email, name, image } = googleLoginDto;
        let user = await this.userService.findOneByEmail(email);
        if (!user) {
            const otp = this.generateOtpCode();
            const otpExpires = new Date(Date.now() + 7 * 60 * 1000);
            user = await this.userService.create({
                email,
                name,
                avatar: image,
                provider: 'google',
                password: '',
                isVerified: false,
                otp,
                otpExpires
            });
            await this.sendOtpEmail(email, otp, 'register');
            console.log(`[Google OTP] Sent to ${email}: ${otp}`);
            return {
                message: 'Google sign up successful. Please verify OTP.',
                user: { email: user.email },
                requiresOtp: true
            };
        }
        if (!user.isVerified) {
            const otp = this.generateOtpCode();
            const otpExpires = new Date(Date.now() + 7 * 60 * 1000);
            await this.userService.update(user.id, { otp, otpExpires });
            await this.sendOtpEmail(email, otp, 'register');
            console.log(`[Google OTP] Resent to ${email}: ${otp}`);
            return {
                message: 'Please verify your email.',
                user: { email: user.email },
                requiresOtp: true
            };
        }
        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'Google login successful',
            user: userWithoutPassword,
            token,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const otp = this.generateOtpCode();
        const otpExpires = new Date(Date.now() + 7 * 60 * 1000);
        await this.userService.update(user.id, {
            otp,
            otpExpires,
        });
        await this.sendOtpEmail(email, otp, 'reset');
        console.log(`[OTP] Forgot Password Sent to ${email}: ${otp}`);
        return {
            message: 'OTP sent successfully',
        };
    }
    async resetPassword(resetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        const user = await this.userService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.otp !== otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (user.otpExpires < new Date()) {
            throw new common_1.BadRequestException('OTP expired');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.update(user.id, {
            password: hashedPassword,
            otp: null,
            otpExpires: null,
        });
        return {
            message: 'Password reset successfully',
        };
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
    generateOtpCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return otp;
    }
    async sendOtpEmail(email, otp, type = 'register') {
        const isReset = type === 'reset';
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpUser = isReset
            ? this.configService.get('SMTP_SUPPORT_USER')
            : this.configService.get('SMTP_USER');
        const smtpPass = isReset
            ? this.configService.get('SMTP_SUPPORT_PASS')
            : this.configService.get('SMTP_PASS');
        const smtpFrom = isReset
            ? '"Al-Moslem Support" <support@almoslem.haniipp.space>'
            : this.configService.get('SMTP_FROM');
        if (!smtpHost || !smtpUser || !smtpPass) {
            console.warn('[OTP] SMTP configuration missing. Email not sent.');
            return;
        }
        const subject = isReset ? '🔒 Reset Password - Al-Moslem' : '✨ Kunci Akses Eksklusif - Al-Moslem';
        const title = isReset ? 'Permintaan Reset Password' : 'Selamat Datang, Sahabat';
        const messageIntro = isReset
            ? 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Al-Moslem Anda.'
            : 'Selamat datang, Sahabat. Kami sangat bersyukur dan merasa terhormat menyambut Anda menjadi bagian dari keluarga besar <strong>Al-Moslem</strong>.';
        const messageAction = isReset
            ? 'Gunakan kode di bawah ini untuk mengatur ulang kata sandi Anda:'
            : 'Demi menjaga keamanan dan kenyamanan ibadah digital Anda, berikut adalah <strong>Kunci Akses Pribadi</strong> Anda untuk melanjutkan:';
        try {
            const port = Number(this.configService.get('SMTP_PORT')) || 587;
            const transporter = nodemailer.createTransport({
                host: smtpHost,
                port: port,
                secure: port === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            await transporter.sendMail({
                from: smtpFrom,
                to: email,
                subject: subject,
                html: `
          <div style="font-family: 'Georgia', serif; background-color: #f8f9fa; padding: 40px 20px; color: #333; line-height: 1.8;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eef2f5; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #0f766e; font-size: 26px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-family: 'Arial', sans-serif;">Al-Moslem</h1>
                <div style="width: 50px; height: 3px; background: linear-gradient(90deg, #0f766e, #d4af37); margin: 20px auto; border-radius: 2px;"></div>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #4a5568;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
              
              <p style="font-size: 16px; margin-bottom: 25px; color: #4a5568;">
                ${messageIntro}
              </p>
              
              <p style="font-size: 16px; margin-bottom: 35px; color: #4a5568;">
                ${messageAction}
              </p>
              
              <div style="text-align: center; margin: 50px 0;">
                <div style="display: inline-block; background: #f0fdf4; padding: 20px 40px; border-radius: 12px; border: 1px dashed #0f766e;">
                  <span style="font-size: 36px; letter-spacing: 8px; color: #0f766e; font-weight: bold; font-family: 'Courier New', monospace;">${otp}</span>
                </div>
              </div>
              
              <p style="font-size: 14px; color: #718096; text-align: center; margin-bottom: 45px; font-style: italic;">
                Kode ini bersifat rahasia dan hanya berlaku selama <strong>7 menit</strong>.
              </p>
              
              <div style="border-top: 1px solid #eef2f5; padding-top: 30px; text-align: center; font-size: 13px; color: #a0aec0;">
                <p style="margin: 0;">Terima kasih atas kepercayaan Anda.</p>
                <p style="margin: 8px 0 0 0; font-weight: 600; color: #0f766e; font-family: 'Arial', sans-serif;">Salam hangat, Tim Al-Moslem</p>
              </div>
            </div>
          </div>
        `,
            });
        }
        catch (error) {
            console.error('Failed to send email:', error);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map