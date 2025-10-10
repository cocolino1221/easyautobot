import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signUp(data: { email: string; password: string; name: string; companyName: string }) {
    // Validate input
    if (!data.email || !data.email.includes('@')) {
      throw new ConflictException('📧 Please provide a valid email address');
    }

    if (!data.password || data.password.length < 6) {
      throw new ConflictException('🔒 Password must be at least 6 characters long');
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new ConflictException('👤 Please provide your name');
    }

    if (!data.companyName || data.companyName.trim().length === 0) {
      throw new ConflictException('🏢 Please provide your company name');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('📧 An account with this email already exists. Please sign in instead.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create tenant with 7-day trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days from now

    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.companyName,
        plan: 'FREE',
        status: 'TRIALING',
        currentPeriodEnd: trialEndDate,
        maxIntegrations: 4,
        maxMessagesPerMonth: 150, // 5 calls per day * 30 days
        maxTeamMembers: 1,
        maxFlows: 3,
      },
    });

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: 'OWNER',
        tenantId: tenant.id,
      },
      include: { tenant: true },
    });

    return this.generateToken(user);
  }

  async signIn(email: string, password: string) {
    // Validate input
    if (!email || !email.includes('@')) {
      throw new UnauthorizedException('📧 Please provide a valid email address');
    }

    if (!password) {
      throw new UnauthorizedException('🔒 Please provide your password');
    }

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { tenant: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('🔐 Invalid email or password. Please try again.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('🔐 Invalid email or password. Please try again.');
    }

    // Check if tenant is active
    if (user.tenant.status === 'CANCELED') {
      throw new UnauthorizedException('❌ This account has been cancelled. Please contact support.');
    }

    if (user.tenant.status === 'TRIALING' && user.tenant.currentPeriodEnd && new Date() > user.tenant.currentPeriodEnd) {
      throw new UnauthorizedException('⏰ Your trial has expired. Please upgrade your plan to continue.');
    }

    return this.generateToken(user);
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async syncUserFromClerk(clerkData: any) {
    const { id, email_addresses, first_name, last_name, image_url } = clerkData;

    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(' ');

    let user = await this.prisma.user.findUnique({
      where: { clerkId: id },
      include: { tenant: true },
    });

    if (!user) {
      // Create new tenant and user
      const tenant = await this.prisma.tenant.create({
        data: {
          name: `${name}'s Workspace`,
        },
      });

      user = await this.prisma.user.create({
        data: {
          clerkId: id,
          email,
          name,
          role: 'OWNER',
          avatarUrl: image_url,
          tenantId: tenant.id,
        },
        include: { tenant: true },
      });
    }

    return user;
  }

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
