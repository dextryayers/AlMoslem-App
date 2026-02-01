
import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, LoginDto, GoogleLoginDto, VerifyOtpDto, ResendOtpDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phoneNumber } = registerDto;

    // Check if user exists
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = this.generateOtpCode();
    const otpExpires = new Date(Date.now() + 7 * 60 * 1000); // 7 minutes

    // Create user
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

    // Send Email
    await this.sendOtpEmail(email, otp, 'register');
    console.log(`[OTP] Sent to ${email}: ${otp}`);

    // Return without password and token (verification required)
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      message: 'User registered successfully. Please verify OTP.',
      user: userWithoutPassword,
      // No token returned here
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpires < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    // Update user
    await this.userService.update(user.id, {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });

    // Generate token
    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Verification successful',
      user: userWithoutPassword,
      token,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user
    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check verification status
    if (user.provider === 'credentials' && !user.isVerified) {
       throw new UnauthorizedException('Please verify your email first');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const { email, name, image } = googleLoginDto;
    
    let user = await this.userService.findOneByEmail(email);

    if (!user) {
      // Create new user if not exists
      // MODIFIED: Set isVerified to false and send OTP even for Google Sign Up
      const otp = this.generateOtpCode();
      const otpExpires = new Date(Date.now() + 7 * 60 * 1000); // 7 minutes

      user = await this.userService.create({
        email,
        name,
        avatar: image,
        provider: 'google',
        password: '', // No password for google auth
        isVerified: false, // Require OTP verification
        otp,
        otpExpires
      });

      // Send OTP Email
      await this.sendOtpEmail(email, otp, 'register');
      console.log(`[Google OTP] Sent to ${email}: ${otp}`);

      return {
        message: 'Google sign up successful. Please verify OTP.',
        user: { email: user.email }, // Only return minimal info
        requiresOtp: true
      };
    } 
    
    // If user exists but not verified (e.g. previous google signup attempt without verification)
    if (!user.isVerified) {
        // Resend OTP if expired or just remind them
        // For simplicity, let's just tell them to verify.
        // Or better, resend a fresh OTP to be helpful.
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

    // Normal Login Flow (Verified User)
    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Google login successful',
      user: userWithoutPassword,
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security, but for now we can throw not found or just return success
      // To be user friendly we throw NotFound, but security wise we should fake it.
      // Given the casual nature, let's be friendly.
      throw new NotFoundException('User not found');
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpires < new Date()) {
      throw new BadRequestException('OTP expired');
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

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private generateOtpCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  }

  private async sendOtpEmail(email: string, otp: string, type: 'register' | 'reset' = 'register') {
    const isReset = type === 'reset';
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    
    // Determine credentials based on type
    const smtpUser = isReset 
      ? this.configService.get<string>('SMTP_SUPPORT_USER') 
      : this.configService.get<string>('SMTP_USER');
      
    const smtpPass = isReset 
      ? this.configService.get<string>('SMTP_SUPPORT_PASS') 
      : this.configService.get<string>('SMTP_PASS');
      
    const smtpFrom = isReset
      ? '"Al-Moslem Support" <support@almoslem.haniipp.space>'
      : this.configService.get<string>('SMTP_FROM');
    
    // Skip if no config
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
      const port = Number(this.configService.get<number>('SMTP_PORT')) || 587;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: port === 465, // true for 465, false for other ports
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
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw error to user, just log it. They can try resend.
    }
  }
}
