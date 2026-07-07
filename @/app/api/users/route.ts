import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

/**
 * POST /api/users - Create or update user profile by Clerk ID.
 */
export async function POST(request: Request) {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get Clerk ID from auth or optional request parameter  
    const body = await request.json() as { 
      email?: string; 
      username?: string; 
      name?: string | null; 
      clerkId?: string; 
    };

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const clerkId = body.clerkId || clerkUser.id;
    
    // Check if user already exists (optional - let Prisma handle duplicates on create)
    const existingUser = await prisma.user.findFirst({ where: { clerkId } });

    if (existingUser) {
      await prisma.user.update({ 
        where: { id: existingUser.id }, 
        data: { email: body.email, username: body.username ?? '', name: body.name ?? null } 
      });

      return NextResponse.json(existingUser);
    } else {
      const newUser = await prisma.user.create({
        data: { 
          email: body.email!,
          username: body.username ?? '',
          clerkId,
          name: body.name ?? null,
        },
      });

      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    
    // Handle unique constraint violations  
    if ((error as Error).name === 'PrismaClientKnownRequestError') {
      return NextResponse.json({ 
        error: 'Duplicate entry',
        message: `A profile with this email already exists.`
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get Clerk ID from auth or optional request parameter  
    let clerkId: string; 
    const body = await request.json() as { clerkId?: string };
    
    if (!body.clerkId) {
      clerkId = clerkUser.id;
    } else {
      clerkId = body.clerkId;
    }

    // Fetch user with their links (if any exist)  
    const userWithLinks = await prisma.user.findFirst({ 
      where: { clerkId }, 
      include: { links: true } 
    });

    return NextResponse.json(userWithLinks);
  } catch (error) {
    console.error('Error fetching user:', error);
    
    if ((error as Error).name === 'PrismaClientKnownRequestError') {
      return NextResponse.json(
        { 
          error: 'Duplicate entry', 
          message: `A profile with this email already exists.`
        }, 
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}